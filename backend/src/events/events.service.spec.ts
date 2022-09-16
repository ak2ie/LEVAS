import { Test, TestingModule } from '@nestjs/testing';
import { IFirestoreVal, IWherePropParam } from 'fireorm';
import Event from '../firestore/event';
import Answer from '../firestore/answer';
import Setting from '../firestore/setting';
import { CreateEventDto } from './dto/create-event.dto';
import { ResponseEventListDto } from './dto/response-events.dto';
import { EventsService } from './events.service';
import { ResponseEventDto } from './dto/read-event.dto';

const findoneMock = jest.fn();
const createMock = jest.fn();
jest.mock('fireorm', () => {
  return {
    Collection: () => jest.fn(),
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

    // jest.useFakeTimers();
    // jest.setSystemTime(mockDate);
  });

  //   afterEach(() => {
  //     jest.useRealTimers();
  //   });

  it('正常', async () => {
    findoneMock.mockResolvedValue(eventListrecord);

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

  it('正常', async () => {
    findoneMock.mockResolvedValue(eventItemRecord);

    const expected = new ResponseEventDto();
    expected.message = 'dummyMessage';
    expected.leftButtonLabel = 'leftlabel';
    expected.rightButtonLabel = 'rightlabel';
    expected.answers = [
      {
        userName: 'userName1',
        Attendance: 'right',
        date: mockDate,
      },
    ];

    expect(await service.findOne('dummyUserId', 'dummyEventId')).toEqual(
      expected,
    );
  });
});

const eventListrecord = new Setting();
eventListrecord.events = [
  {
    id: '',
    eventID: 'eventID1',
    eventName: 'eventName1',
    message: '',
    leftButtonLabel: '',
    rightButtonLabel: '',
    createdAt: mockDate,
    answers: [
      {
        id: '',
        userID: '',
        userName: '',
        answer: '',
        createdAt: new Date(),
      },
    ],
  },
  {
    id: '',
    eventID: 'eventID2',
    eventName: 'eventName2',
    message: '',
    leftButtonLabel: '',
    rightButtonLabel: '',
    createdAt: mockDate,
    answers: [
      {
        id: '',
        userID: '',
        userName: '',
        answer: '',
        createdAt: new Date(),
      },
    ],
  },
];

const eventItemRecord = new Setting();
eventItemRecord.events = [
  // 取得対象イベント
  {
    id: '',
    eventID: 'dummyEventId',
    eventName: 'eventName1',
    message: 'dummyMessage',
    leftButtonLabel: 'leftlabel',
    rightButtonLabel: 'rightlabel',
    createdAt: mockDate,
    answers: [
      {
        id: '',
        userID: 'userID1',
        userName: 'userName1',
        answer: 'right',
        createdAt: mockDate,
      },
    ],
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
    answers: [
      {
        id: '',
        userID: '',
        userName: '',
        answer: '',
        createdAt: new Date(),
      },
    ],
  },
];
