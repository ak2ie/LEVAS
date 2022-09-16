import { Test, TestingModule } from '@nestjs/testing';
import Event from 'src/firestore/event';
import User from 'src/firestore/user';
import Setting from '../firestore/setting';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { SettingService } from './setting.service';

const dummyVal = new Setting();
const createFunc = jest.fn();
const findOneMock = jest.fn();
const updateMock = jest.fn();
jest.mock('fireorm', () => {
  return {
    Collection: () => jest.fn(),
    getRepository: () => ({
      create: createFunc,
      whereEqualTo: (prop: any, val: any) => {
        return {
          findOne: findOneMock,
        };
      },
      update: updateMock,
    }),
  };
});

describe('チャネルID・シークレット登録', () => {
  let service: SettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingService],
    }).compile();

    service = module.get<SettingService>(SettingService);
  });

  it('正常', async () => {
    const dto = new CreateSettingDto();
    dto.channelID = 'dummy_channelID';
    dto.channelSecret = 'dummy_channelSecret';
    await service.saveChannelIDAndSecret('dummyId', dto);

    const expected = new Setting();
    expected.channelID = dto.channelID;
    expected.channelSecret = dto.channelSecret;
    expected.userId = 'dummyId';
    expect(createFunc).toHaveBeenCalledWith(expected);
  });
});

describe('チャネルID・シークレット登録有無の取得', () => {
  let service: SettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingService],
    }).compile();

    service = module.get<SettingService>(SettingService);
  });

  it('登録済', async () => {
    dummyVal.channelID = 'aaa';
    dummyVal.channelSecret = 'bbb';
    findOneMock.mockReturnValue(
      new Promise((resolve) => {
        resolve(dummyVal);
      }),
    );
    expect(await service.getIsSavedChannelIDAndSecret('dummyId')).toBe(true);
  });

  it('未登録', async () => {
    dummyVal.channelID = '';
    dummyVal.channelSecret = '';
    findOneMock.mockReturnValue(
      new Promise((resolve) => {
        resolve(dummyVal);
      }),
    );
    expect(await service.getIsSavedChannelIDAndSecret('dummyId')).toBe(false);
  });

  it('ユーザー取得失敗', async () => {
    findOneMock.mockReturnValue(
      new Promise((resolve) => {
        resolve(null);
      }),
    );
    await expect(
      service.getIsSavedChannelIDAndSecret('dummyId'),
    ).rejects.toThrow();
  });
});

describe('友だち更新', () => {
  let service: SettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingService],
    }).compile();

    service = module.get<SettingService>(SettingService);
  });

  afterEach(() => {
    createFunc.mockReset();
    findOneMock.mockReset();
    updateMock.mockReset();
  });

  it('正常', async () => {
    const dto = new UpdateFriendDto();
    dto.userID = 'dummyFriendId';
    dto.userName = 'newFriendName';
    dto.memo = 'memo';

    findOneMock.mockReturnValue(
      new Promise((resolve) => {
        resolve(friendData);
      }),
    );

    let update: { users: Array<User>; events: Array<Event> };
    updateMock.mockImplementation((updateData) => {
      update = updateData;
    });

    // 処理実行
    await service.updateFriendInfo('dummyAdminId', 'dummyFriendId', dto);

    // ユーザー情報の名前が更新されること
    update.users.map((user) => {
      if (user.userID === 'dummyFriendId') {
        expect(user.userName).toBe(dto.userName);
      }
    });

    // 参加登録の名前が更新されること
    update.events.map((event) => {
      event.answers.map((answer) => {
        if (answer.userID === 'dummyFriendId') {
          expect(answer.userName).toBe(dto.userName);
        }
      });
    });
  });
});

const friendData: { users: Array<User>; events: Array<Event> } = {
  users: [
    {
      userID: 'dummyFriendId',
      memo: '',
      userName: 'oldFriendName',
      id: '',
      lineID: '',
      createdAt: new Date(),
    },
    {
      userID: 'dummyOtherFriendId',
      memo: '',
      userName: 'otherFriendName',
      id: '',
      lineID: '',
      createdAt: new Date(),
    },
  ],
  events: [
    {
      id: '',
      eventID: '',
      eventName: '',
      message: '',
      leftButtonLabel: '',
      rightButtonLabel: '',
      answers: [
        {
          userID: 'dummyFriendId',
          userName: 'oldFriendName',
          id: '',
          answer: '',
          createdAt: new Date(),
        },
        {
          userID: 'dummyOtherFriendId',
          userName: 'otherFriendName',
          id: '',
          answer: '',
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },
    {
      id: '',
      eventID: '',
      eventName: '',
      message: '',
      leftButtonLabel: '',
      rightButtonLabel: '',
      answers: [
        {
          userID: 'dummyFriendId',
          userName: 'oldFriendName',
          id: '',
          answer: '',
          createdAt: new Date(),
        },
        {
          userID: 'dummyOtherFriendId',
          userName: 'otherFriendName',
          id: '',
          answer: '',
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(),
    },
  ],
};
