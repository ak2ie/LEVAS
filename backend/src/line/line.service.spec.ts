import { Client, MessageAPIResponseBase, Profile } from '@line/bot-sdk';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ISubCollection } from 'fireorm';
import Setting from '../firestore/setting';
import Event from 'src/firestore/event';
import {
  CreateLineDto,
  LINEEvent,
  LINESource,
  PostbackEvent,
} from './dto/create-line.dto';
import { CreateLineMessageDto } from './dto/create-lineMessage';
import { LineService } from './line.service';
import User from 'src/firestore/user';
import Answer from 'src/firestore/answer';

// const findoneMock = jest.fn();
const whereEqualToMock = jest.fn();

jest.mock('fireorm', () => {
  return {
    Collection: () => jest.fn(),
    SubCollection: () => jest.fn(),
    getRepository: () => ({
      create: (_) => {
        const setting = new Setting();
        setting.id = '1';
        return setting;
      },
      whereEqualTo: whereEqualToMock,
      // (prop: any, val: any) => {
      //   return {
      //     findOne: findoneMock,
      //   };
      // },
    }),
  };
});

describe('ブロードキャストメッセージ送信', () => {
  let service: LineService;
  let spy: jest.SpyInstance<Promise<MessageAPIResponseBase>>;

  beforeEach(async () => {
    const client = new Client({
      channelAccessToken: 'dummy',
      channelSecret: 'dummy',
    });
    spy = jest.spyOn(client, 'broadcast').mockImplementation();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LineService,
        {
          provide: Client,
          useFactory: () => {
            return client;
          },
        },
      ],
    }).compile();

    service = await module.resolve<LineService>(LineService);
  });

  afterEach(() => {
    spy.mockClear();
  });

  it('正常', async () => {
    /* --------------------------------------------------------------------------
     * テスト準備
     * -------------------------------------------------------------------------- */
    const dto = new CreateLineMessageDto();
    dto.leftButtonLabel = '左側';
    dto.rightButtonLabel = '右側';
    dto.message = 'ダミーメッセージ';

    /* --------------------------------------------------------------------------
     * 実行
     * -------------------------------------------------------------------------- */
    await service.sendBroadcastMessage(dto);

    /* --------------------------------------------------------------------------
     * 検証
     * -------------------------------------------------------------------------- */
    expect(spy).toBeCalledWith({
      type: 'template',
      altText: 'ダミーメッセージ',
      template: {
        type: 'confirm',
        text: 'ダミーメッセージ',
        actions: [
          {
            type: 'postback',
            label: '左側',
            data: '',
            displayText: '送信しました',
          },
          {
            type: 'postback',
            label: '右側',
            data: '',
            displayText: '送信しました',
          },
        ],
      },
    });
  });
});

describe('友だち登録', () => {
  let service: LineService;
  let spyLineClient: jest.SpyInstance<Promise<Profile>>;
  let client: Client;

  beforeEach(async () => {
    client = new Client({
      channelAccessToken: 'dummy',
      channelSecret: 'dummy',
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LineService,
        {
          provide: Client,
          useFactory: () => {
            return client;
          },
        },
      ],
    }).compile();

    service = await module.resolve<LineService>(LineService);

    jest.useFakeTimers();
    const mockDate = new Date(2020, 2, 5);
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    spyLineClient.mockClear();
    jest.useRealTimers();
  });

  it('正常', async () => {
    /* --------------------------------------------------------------------------
     * テスト準備
     * -------------------------------------------------------------------------- */
    const setting = new Setting();
    // findoneMock.mockResolvedValue(setting);
    whereEqualToMock.mockImplementation((prop, val) => {
      return {
        findOne: () => {
          if (val === 'dummyAdminLINEId') {
            return new Promise((resolve) => resolve(setting));
          }
        },
      };
    });

    const users = {} as unknown;
    const usersMock = users as ISubCollection<User>;
    usersMock.create = jest.fn();
    setting.users = usersMock;

    // LINEプロフィール取得モックAPI
    spyLineClient = jest.spyOn(client, 'getProfile').mockResolvedValue({
      displayName: 'LINE表示名',
      pictureUrl: 'https://example.com/img.jpg',
      statusMessage: '',
      userId: 'LINE_ID',
    });

    /* --------------------------------------------------------------------------
     * 実行
     * -------------------------------------------------------------------------- */
    const event = {
      type: 'follow',
      timestamp: new Date().getTime(),
      source: {
        type: 'user',
        userId: 'LINE_ID',
      },
    };
    await service.followHander('dummyAdminLINEId', event);

    /* --------------------------------------------------------------------------
     * 検証
     * -------------------------------------------------------------------------- */
    expect(setting.users.create).toHaveBeenCalledWith({
      lineID: 'LINE_ID',
      lineUserName: 'LINE表示名',
      userName: 'LINE表示名',
      memo: '',
      imgUrl: 'https://example.com/img.jpg',
      createdAt: new Date(),
    });
  });
});

describe('イベント参加登録', () => {
  let service: LineService;
  let client: Client;

  beforeEach(async () => {
    client = new Client({
      channelAccessToken: 'dummy',
      channelSecret: 'dummy',
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LineService,
        {
          provide: Client,
          useFactory: () => {
            return client;
          },
        },
      ],
    }).compile();

    service = await module.resolve<LineService>(LineService);

    jest.useFakeTimers();
    const mockDate = new Date(2020, 2, 5);
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    whereEqualToMock.mockClear();
  });

  it('登録済ユーザー(初回登録)', async () => {
    /* --------------------------------------------------------------------------
     * テスト準備
     * -------------------------------------------------------------------------- */
    const eventsRecord = new Event();
    const answers = {} as unknown;
    const answersMock = answers as ISubCollection<Answer>;
    answersMock.update = jest.fn();
    eventsRecord.answers = answersMock;

    // 参加登録
    answersMock.whereEqualTo = jest.fn().mockImplementation((prop, val) => {
      return {
        findOne: () => {
          if (val === 'dummyFirebaseUserId') {
            return new Promise((resolve) => {
              resolve(undefined); // 参加は未登録
            });
          }
        },
      };
    });

    // イベント
    const events = {} as unknown;
    const eventsMock = events as ISubCollection<Event>;
    eventsMock.whereEqualTo = jest.fn().mockImplementation((prop, val) => {
      return {
        findOne: () => {
          if (val === 'dummyEventID') {
            return new Promise((resolve) => {
              resolve(eventsRecord);
            });
          }
        },
      };
    });

    // ユーザー
    const users = {} as unknown;
    const usersMock = users as ISubCollection<User>;
    usersMock.whereEqualTo = jest.fn().mockImplementation((prop, val) => {
      return {
        findOne: () => {
          if (val === 'dummyUserId') {
            return new Promise((resolve) => {
              const user = new User();
              user.id = 'dummyFirebaseUserId';
              resolve(user);
            });
          }
        },
      };
    });

    const setting = new Setting();
    setting.events = eventsMock;
    setting.users = usersMock;

    whereEqualToMock.mockImplementation((prop, val) => {
      return {
        findOne: () => {
          if (val === 'dummyAdminLINEId') {
            return new Promise((resolve) => {
              resolve(setting);
            });
          }
        },
      };
    });

    // LINE受信
    const event = new LINEEvent();
    const source = new LINESource();
    source.userId = 'dummyUserId';
    event.source = source;
    const postBack = new PostbackEvent();
    postBack.data = JSON.stringify({ eventID: 'dummyEventID', answer: 'left' });
    event.postback = postBack;

    /* --------------------------------------------------------------------------
     * 実行
     * -------------------------------------------------------------------------- */
    await service.postbackHander('dummyAdminLINEId', event);

    /* --------------------------------------------------------------------------
     * 検証
     * -------------------------------------------------------------------------- */
    expect(eventsRecord.answers.update).toHaveBeenCalledWith({
      answer: 'left',
      userFirebaseId: 'dummyFirebaseUserId',
      createdAt: new Date(),
    });
  });

  it('登録済ユーザー(参加登録済)', async () => {
    /* --------------------------------------------------------------------------
     * テスト準備
     * -------------------------------------------------------------------------- */
    const eventsRecord = new Event();
    const answers = {} as unknown;
    const answersMock = answers as ISubCollection<Answer>;
    answersMock.update = jest.fn();
    eventsRecord.answers = answersMock;

    // 参加登録
    answersMock.whereEqualTo = jest.fn().mockImplementation((prop, val) => {
      return {
        findOne: () => {
          if (val === 'dummyFirebaseUserId') {
            return new Promise((resolve) => {
              const answer = new Answer();
              answer.answer = 'right';
              answer.userFirebaseId = 'dummyFirebaseUserId';
              answer.userName = 'dummyUserName';
              answer.createdAt = new Date(2020, 1, 1);
              resolve(answer); // 参加は登録済
            });
          }
        },
      };
    });

    // イベント
    const events = {} as unknown;
    const eventsMock = events as ISubCollection<Event>;
    eventsMock.whereEqualTo = jest.fn().mockImplementation((prop, val) => {
      return {
        findOne: () => {
          if (val === 'dummyEventID') {
            return new Promise((resolve) => {
              resolve(eventsRecord);
            });
          }
        },
      };
    });

    // ユーザー
    const users = {} as unknown;
    const usersMock = users as ISubCollection<User>;
    usersMock.whereEqualTo = jest.fn().mockImplementation((prop, val) => {
      return {
        findOne: () => {
          if (val === 'dummyUserId') {
            return new Promise((resolve) => {
              const user = new User();
              user.id = 'dummyFirebaseUserId';
              resolve(user);
            });
          }
        },
      };
    });

    const setting = new Setting();
    setting.events = eventsMock;
    setting.users = usersMock;

    whereEqualToMock.mockImplementation((prop, val) => {
      return {
        findOne: () => {
          if (val === 'dummyAdminLINEId') {
            return new Promise((resolve) => {
              resolve(setting);
            });
          }
        },
      };
    });

    // LINE受信
    const event = new LINEEvent();
    const source = new LINESource();
    source.userId = 'dummyUserId';
    event.source = source;
    const postBack = new PostbackEvent();
    postBack.data = JSON.stringify({ eventID: 'dummyEventID', answer: 'left' });
    event.postback = postBack;

    /* --------------------------------------------------------------------------
     * 実行
     * -------------------------------------------------------------------------- */
    await service.postbackHander('dummyAdminLINEId', event);

    /* --------------------------------------------------------------------------
     * 検証
     * -------------------------------------------------------------------------- */
    expect(eventsRecord.answers.update).toHaveBeenCalledWith({
      answer: 'left',
      userFirebaseId: 'dummyFirebaseUserId',
      createdAt: new Date(),
    });
  });

  it('未登録ユーザー', async () => {
    /* --------------------------------------------------------------------------
     * テスト準備
     * -------------------------------------------------------------------------- */
    const eventsRecord = new Event();
    const answers = {} as unknown;
    const answersMock = answers as ISubCollection<Answer>;
    answersMock.update = jest.fn();
    eventsRecord.answers = answersMock;

    // 参加登録
    answersMock.whereEqualTo = jest.fn().mockImplementation((prop, val) => {
      return {
        findOne: () => {
          if (val === 'dummyFirebaseUserId') {
            return new Promise((resolve) => {
              resolve(undefined); // 参加は未登録
            });
          }
        },
      };
    });

    const events = {} as unknown;
    const eventsMock = events as ISubCollection<Event>;
    eventsMock.whereEqualTo = jest.fn().mockImplementation((prop, val) => {
      return {
        findOne: () => {
          if (val === 'dummyEventID') {
            return new Promise((resolve) => {
              resolve(eventsRecord);
            });
          }
        },
      };
    });

    const users = {} as unknown;
    const usersMock = users as ISubCollection<User>;
    usersMock.whereEqualTo = jest
      .fn()
      .mockImplementationOnce((prop, val) => {
        return {
          findOne: () => {
            if (val === 'dummyUserId') {
              return new Promise((resolve) => {
                resolve(undefined);
              });
            }
          },
        };
      })
      .mockImplementationOnce((prop, val) => {
        return {
          findOne: () => {
            if (val === 'dummyUserId') {
              return new Promise((resolve) => {
                const user = new User();
                user.id = 'dummyFirebaseUserId';
                resolve(user);
              });
            }
          },
        };
      });

    const setting = new Setting();
    setting.events = eventsMock;
    setting.users = usersMock;

    whereEqualToMock.mockImplementation((prop, val) => {
      return {
        findOne: () => {
          if (val === 'dummyAdminLINEId') {
            return new Promise((resolve) => {
              resolve(setting);
            });
          }
        },
      };
    });

    const event = new LINEEvent();
    const source = new LINESource();
    source.userId = 'dummyUserId';
    event.source = source;
    const postBack = new PostbackEvent();
    postBack.data = JSON.stringify({ eventID: 'dummyEventID', answer: 'left' });
    event.postback = postBack;

    service.followHander = jest.fn();

    /* --------------------------------------------------------------------------
     * 実行
     * -------------------------------------------------------------------------- */
    await service.postbackHander('dummyAdminLINEId', event);

    /* --------------------------------------------------------------------------
     * 検証
     * -------------------------------------------------------------------------- */
    expect(eventsRecord.answers.update).toHaveBeenCalledWith({
      answer: 'left',
      userFirebaseId: 'dummyFirebaseUserId',
      createdAt: new Date(),
    });
  });
});
