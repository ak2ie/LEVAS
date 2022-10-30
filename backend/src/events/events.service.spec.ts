import { Test, TestingModule } from '@nestjs/testing';
import {
  getRepository,
  IFirestoreVal,
  IQueryBuilder,
  ISubCollection,
  IWherePropParam,
  SubCollection,
} from 'fireorm';
import Event from '../firestore/event';
import Setting from '../firestore/setting';
import Answer from 'src/firestore/answer';
import { CreateEventDto } from './dto/create-event.dto';
import { ResponseEventListDto } from './dto/response-events.dto';
import { EventsService } from './events.service';
import {
  EventDetail,
  ResponseEventDto,
  Answer as AnswerDTO,
} from './dto/read-event.dto';

const findoneMock = jest.fn();
const createMock = jest.fn();
jest.mock('fireorm', () => {
  return {
    Collection: () => jest.fn(),
    SubCollection: () => jest.fn(),
    getRepository: () => ({
      create: createMock,
      whereEqualTo: (prop: any, val: any) => {
        return {
          findOne: findoneMock,
        };
      },
    }),
  };
});

const mockDate = new Date(2021, 0, 1, 1, 1, 1); // 日時に意味はなく、固定したいだけ。

describe('イベント一覧取得', () => {
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsService],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    findoneMock.mockReset();
  });

  it('正常', async () => {
    /* --------------------------------------------------------------------------
     * テスト準備
     * -------------------------------------------------------------------------- */
    const setting = new Setting();

    const events = {} as unknown;
    const eventsMock = events as ISubCollection<Event>;
    eventsMock.execute = jest.fn();
    setting.events = testDataAllEvents();

    findoneMock.mockResolvedValue(setting);

    /* --------------------------------------------------------------------------
     * 期待値
     * -------------------------------------------------------------------------- */
    const expected = new ResponseEventListDto();
    expected.events = [
      {
        eventID: 'eventID1',
        eventName: 'eventName1',
        createdAt: mockDate,
      },
      {
        eventID: 'eventID2',
        eventName: 'eventName2',
        createdAt: mockDate,
      },
    ];

    /* --------------------------------------------------------------------------
     * テスト実行
     * -------------------------------------------------------------------------- */
    expect(await service.findAll('dummy_id')).toEqual(expected);
  });
});

describe('個別イベント取得', () => {
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsService],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    findoneMock.mockReset();
  });

  it('正常', async () => {
    /* --------------------------------------------------------------------------
     * テスト準備
     * -------------------------------------------------------------------------- */
    // Settingコレクション
    const setting = new Setting();
    setting.events = {} as ISubCollection<Event>;
    findoneMock.mockResolvedValue(setting);
    setting.events = testDataEvent();

    /* --------------------------------------------------------------------------
     * 期待値
     * -------------------------------------------------------------------------- */
    const expected = new ResponseEventDto();

    const event = new EventDetail();
    event.message = 'dummyMessage';
    event.leftButtonLabel = 'leftlabel';
    event.rightButtonLabel = 'rightlabel';

    const answer = new AnswerDTO();
    answer.userName = 'userName1';
    answer.Attendance = 'right';
    answer.date = mockDate;

    event.answers = [answer];
    expected.event = event;

    /* --------------------------------------------------------------------------
     * 試験実施
     * -------------------------------------------------------------------------- */
    expect(await service.findOne('dummyUserId', 'dummyEventId')).toEqual(
      expected,
    );
  });
});

/* --------------------------------------------------------------------------
 * テストデータ
 * -------------------------------------------------------------------------- */
/**
 * 全イベント取得用
 */
function testDataAllEvents() {
  const events = {} as unknown;
  const eventsMock = events as ISubCollection<Event>;
  eventsMock.find = jest.fn();

  jest.spyOn(eventsMock, 'find').mockImplementation(() => {
    const answers = {} as unknown;
    const answersMock = answers as ISubCollection<Answer>; // 読み出されないので非実装

    return new Promise((resolve) => {
      resolve([
        {
          id: 'eventID1',
          eventName: 'eventName1',
          message: '',
          leftButtonLabel: '',
          rightButtonLabel: '',
          createdAt: mockDate,
          answers: answersMock,
        },
        {
          id: 'eventID2',
          eventName: 'eventName2',
          message: '',
          leftButtonLabel: '',
          rightButtonLabel: '',
          createdAt: mockDate,
          answers: answersMock,
        },
      ]);
    });
  });

  return eventsMock;
}

/**
 * 個別イベント取得用
 */

function testDataEvent() {
  const events = {} as unknown;
  const eventsMock = events as ISubCollection<Event>;
  eventsMock.findById = jest.fn();

  jest.spyOn(eventsMock, 'findById').mockImplementation((id) => {
    const answers = {} as unknown;
    const answersMock = answers as ISubCollection<Answer>;
    answersMock.find = jest.fn();
    jest.spyOn(answersMock, 'find').mockResolvedValue([
      {
        id: '',
        userFirebaseId: 'userID1',
        userName: 'userName1',
        answer: 'right',
        createdAt: mockDate,
      },
    ]);

    const answers2 = {} as unknown;
    const answersMock2 = answers2 as ISubCollection<Answer>; // 取得対象外イベントのため非実装

    return new Promise((resolve) => {
      const eventsData = [
        // 取得対象イベント
        {
          id: '',
          eventID: 'dummyEventId',
          eventName: 'eventName1',
          message: 'dummyMessage',
          leftButtonLabel: 'leftlabel',
          rightButtonLabel: 'rightlabel',
          createdAt: mockDate,
          answers: answersMock,
        },
        // 取得対象外イベント
        {
          id: '',
          eventID: 'eventID2',
          eventName: 'eventName2',
          message: '',
          leftButtonLabel: '',
          rightButtonLabel: '',
          createdAt: mockDate,
          answers: answersMock2,
        },
      ];

      const event = eventsData.filter((event) => event.eventID === id);
      resolve(event[0]);
    });
  });

  return eventsMock;
}
