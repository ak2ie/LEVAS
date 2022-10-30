import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import {
  IFirestoreVal,
  IQueryBuilder,
  ISubCollection,
  IWherePropParam,
} from 'fireorm';
import { of, throwError } from 'rxjs';
import Answer from 'src/firestore/answer';
import Event from 'src/firestore/event';
import User from 'src/firestore/user';
import { LineService } from 'src/line/line.service';
import Setting from '../firestore/setting';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { SettingService } from './setting.service';
import { AxiosResponse, AxiosError } from 'axios';

const dummyVal = new Setting();
const createFunc = jest.fn();
const findOneMock = jest.fn();
const updateMock = jest.fn();
const batchUpdateMock = jest.fn();
const whereEqualToMock = jest.fn();
jest.mock('fireorm', () => {
  return {
    Collection: () => jest.fn(),
    SubCollection: () => jest.fn(),
    getRepository: () => ({
      create: createFunc,
      whereEqualTo: whereEqualToMock,
      // (prop: any, val: any) => {
      //   return {
      //     findOne: findOneMock,
      //   };
      // },
      update: updateMock,
    }),
    createBatch: () => ({
      getRepository: () => ({
        update: batchUpdateMock,
      }),
      commit: () => jest.fn(),
    }),
  };
});

describe('チャネルID・シークレット登録', () => {
  let service: SettingService;
  let httpService: HttpService;
  let mockHttpService;

  beforeEach(async () => {
    mockHttpService = {
      post: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      // imports: [HttpModule],
      providers: [
        SettingService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<SettingService>(SettingService);
    // httpService = module.get<HttpService>(HttpService);

    jest.useFakeTimers();
    const mockDate = new Date(2020, 2, 5);
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
    mockHttpService.post.mockReset();
    createFunc.mockReset();
    updateMock.mockReset();
    whereEqualToMock.mockReset();
  });

  it('正常（新規）', async () => {
    /* --------------------------------------------------------------------------
     * テスト準備
     * -------------------------------------------------------------------------- */
    // LINEサーバーモック（正常）
    const response: AxiosResponse<any> = {
      data: {
        access_token: 'dummy_accessToken', // アクセストークン
        expires_in: 2592000,
        token_type: 'Bearer',
      },
      headers: {},
      config: { url: 'https://api.line.me/v2/oauth/accessToken' },
      status: 200,
      statusText: 'OK',
    };
    mockHttpService.post.mockImplementation(() => of(response));

    // DB
    whereEqualToMock.mockImplementation((prop: any, val: any) => ({
      findOne: () =>
        new Promise((resolve) => {
          if (val === 'dummy_FirebaseId') {
            // 対象ユーザーIDは未登録
            resolve(null);
          } else {
            // 対象ユーザーID以外は登録済
            resolve(new Setting());
          }
        }),
    }));

    const dto = new CreateSettingDto();
    dto.channelID = 'dummy_channelID';
    dto.channelSecret = 'dummy_channelSecret';

    await service.saveChannelIDAndSecret('dummy_FirebaseId', dto);

    /* --------------------------------------------------------------------------
     * 検証
     * -------------------------------------------------------------------------- */
    const expected = new Setting();
    expected.channelID = 'dummy_channelID';
    expected.channelSecret = 'dummy_channelSecret';
    expected.userFirebaseId = 'dummy_FirebaseId';
    expected.accessToken = 'dummy_accessToken';
    expected.createdAt = new Date();
    expect(createFunc).toHaveBeenCalledWith(expected);

    expect(mockHttpService.post).toBeCalled();

    expect(updateMock).not.toHaveBeenCalled();
  });

  it('正常（更新）', async () => {
    /* --------------------------------------------------------------------------
     * テスト準備
     * -------------------------------------------------------------------------- */
    // LINEサーバーモック（正常）
    const response: AxiosResponse<any> = {
      data: {
        access_token: 'dummy_accessToken', // アクセストークン
        expires_in: 2592000,
        token_type: 'Bearer',
      },
      headers: {},
      config: { url: 'https://api.line.me/v2/oauth/accessToken' },
      status: 200,
      statusText: 'OK',
    };
    mockHttpService.post.mockImplementation(() => of(response));

    // DB
    whereEqualToMock.mockImplementation((prop: any, val: any) => ({
      findOne: () => {
        if (val === 'dummy_FirebaseId') {
          // 対象ユーザーIDは登録済
          return new Promise((resolve) => {
            const setting = new Setting();
            setting.accessToken = 'oldToken';
            resolve(setting);
          });
        } else {
          // 対象ユーザーID以外は未登録
          return new Promise((resolve) => {
            resolve(null);
          });
        }
      },
    }));

    const dto = new CreateSettingDto();
    dto.channelID = 'dummy_channelID';
    dto.channelSecret = 'dummy_channelSecret';

    await service.saveChannelIDAndSecret('dummy_FirebaseId', dto);

    /* --------------------------------------------------------------------------
     * 検証
     * -------------------------------------------------------------------------- */
    const expected = new Setting();
    expected.channelID = 'dummy_channelID';
    expected.channelSecret = 'dummy_channelSecret';
    expected.accessToken = 'dummy_accessToken';
    expect(updateMock).toHaveBeenCalledWith(expected);

    expect(mockHttpService.post).toBeCalled();

    expect(createFunc).not.toHaveBeenCalled();
  });

  it('異常（トークン取得失敗）', async () => {
    /* --------------------------------------------------------------------------
     * テスト準備
     * -------------------------------------------------------------------------- */
    const dto = new CreateSettingDto();
    dto.channelID = 'dummy_channelID';
    dto.channelSecret = 'dummy_channelSecret';

    // LINEサーバーモック（エラー）
    const error: AxiosError<any> = {
      code: '400',
      config: {},
      isAxiosError: true,
      message: '',
      name: '',
      toJSON: () => null,
    };
    mockHttpService.post = jest.fn(() => throwError(() => error));

    /* --------------------------------------------------------------------------
     * 検証
     * -------------------------------------------------------------------------- */
    await expect(
      service.saveChannelIDAndSecret('dummy_FirebaseId', dto),
    ).rejects.toThrow();
  });
});

describe('チャネルID・シークレット登録有無の取得', () => {
  let service: SettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [SettingService],
    }).compile();

    service = module.get<SettingService>(SettingService);
  });

  it('登録済', async () => {
    whereEqualToMock.mockImplementation((prop: any, val: any) => ({
      findOne: () => {
        if (val === 'dummy_FirebaseId') {
          // 対象ユーザーIDは登録済
          return new Promise((resolve) => {
            const setting = new Setting();
            setting.channelID = 'dummy_channelID';
            setting.channelSecret = 'dummy_channelSecret';
            resolve(setting);
          });
        } else {
          // 対象ユーザーID以外は未登録
          return new Promise((resolve) => {
            resolve(null);
          });
        }
      },
    }));

    expect(await service.getIsSavedChannelIDAndSecret('dummy_FirebaseId')).toBe(
      true,
    );
  });

  it('ユーザー未登録', async () => {
    whereEqualToMock.mockImplementation((prop: any, val: any) => ({
      findOne: () => {
        return new Promise((resolve) => {
          if (val === 'dummy_FirebaseId') {
            // 対象ユーザーIDは未登録
            resolve(null);
          } else {
            const setting = new Setting();
            // 対象ユーザーID以外は登録済
            setting.channelID = 'dummy';
            setting.channelSecret = 'dummy';
            resolve(setting);
          }
        });
      },
    }));

    expect(await service.getIsSavedChannelIDAndSecret('dummy_FirebaseId')).toBe(
      false,
    );
  });

  it('チャネルID・シークレット未登録', async () => {
    whereEqualToMock.mockImplementation((prop: any, val: any) => ({
      findOne: () => {
        return new Promise((resolve) => {
          const setting = new Setting();
          if (val === 'dummy_FirebaseId') {
            // 対象ユーザーIDは未登録
            setting.channelID = '';
            setting.channelSecret = '';
          } else {
            // 対象ユーザーID以外は登録済
            setting.channelID = 'dummy';
            setting.channelSecret = 'dummy';
          }
          resolve(setting);
        });
      },
    }));

    expect(await service.getIsSavedChannelIDAndSecret('dummy_FirebaseId')).toBe(
      false,
    );
  });
});

describe('友だち更新', () => {
  let service: SettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [SettingService],
    }).compile();

    service = module.get<SettingService>(SettingService);
  });

  afterEach(() => {
    createFunc.mockReset();
    findOneMock.mockReset();
    updateMock.mockReset();
    batchUpdateMock.mockReset();
  });

  it('正常', async () => {
    const dto = new UpdateFriendDto();
    dto.userID = 'dummyFriendId';
    dto.userName = 'newFriendName';
    dto.memo = 'memo';

    const updateFriendMock = updateFriendData();

    // Settingsコレクション
    whereEqualToMock.mockImplementation((prop: any, val: any) => ({
      findOne: () => {
        return new Promise((resolve) => {
          if (val === 'dummyAdminId') {
            // 対象ユーザーIDは登録済
            resolve(updateFriendMock);
          } else {
            // 対象ユーザーID以外は未登録
            resolve(null);
          }
        });
      },
    }));

    // 処理実行
    await service.updateFriendInfo('dummyAdminId', dto);

    // ユーザー情報の名前が更新されること
    expect(updateFriendMock.users.update).toHaveBeenCalledWith({
      id: 'dummyFriendId',
      userName: 'newFriendName',
      lineID: '',
      lineUserName: '',
      memo: 'memo',
      createdAt: new Date(2022, 8, 10),
      imgUrl: '',
    });

    // 参加登録の名前が更新されること
    expect(batchUpdateMock).toHaveBeenCalledWith({
      userFirebaseId: 'dummyFriendId',
      userName: 'newFriendName',
      id: '',
      answer: '',
      createdAt: new Date(2022, 8, 10),
    });
  });
});

function updateFriendData() {
  // ユーザー
  const users = {} as unknown;
  const usersMock = users as ISubCollection<User>;
  usersMock.findById = jest.fn();
  usersMock.update = jest.fn(); // 結果確認用

  jest.spyOn(usersMock, 'findById').mockImplementation((id) => {
    return new Promise((resolve) => {
      resolve(
        id === 'dummyFriendId'
          ? {
              memo: '',
              userName: 'oldFriendName',
              id: 'dummyFriendId',
              lineID: '',
              createdAt: new Date(2022, 8, 10),
              lineUserName: '',
              imgUrl: '',
            }
          : undefined,
      );
    });
  });

  // 参加可否
  const answers = {} as unknown;
  const answersMock = answers as ISubCollection<Answer>;
  answersMock.whereEqualTo = jest.fn();

  jest
    .spyOn(answersMock, 'whereEqualTo')
    .mockImplementation((prop: IWherePropParam<Answer>, val: IFirestoreVal) => {
      const queryBuilder = {} as unknown;
      const queryBuilderMock = queryBuilder as IQueryBuilder<Answer>;
      queryBuilderMock.find = jest.fn();

      jest.spyOn(queryBuilderMock, 'find').mockImplementation(() => {
        return new Promise((resolve) => {
          const answers = [
            {
              userFirebaseId: 'dummyFriendId',
              userName: 'oldFriendName',
              id: '',
              answer: '',
              createdAt: new Date(2022, 8, 10),
            },
            {
              userFirebaseId: 'dummyOtherFriendId',
              userName: 'otherFriendName',
              id: '',
              answer: '',
              createdAt: new Date(2022, 8, 10),
            },
          ];

          const answer = answers.filter(
            (answer) => answer.userFirebaseId === val.toString(),
          );
          resolve(answer);
        });
      });

      return queryBuilderMock;
    });

  // イベント
  const events = {} as unknown;
  const eventsMock = events as ISubCollection<Event>;
  eventsMock.find = jest.fn();

  jest.spyOn(eventsMock, 'find').mockResolvedValue([
    {
      id: '',
      eventName: '',
      message: '',
      leftButtonLabel: '',
      rightButtonLabel: '',
      answers: answersMock,
      createdAt: new Date(),
    },
  ]);

  return {
    users: usersMock,
    events: eventsMock,
  };
}
