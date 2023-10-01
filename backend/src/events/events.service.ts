import { Inject, Injectable } from '@nestjs/common';
import { FirestoreOperators, getRepository } from 'fireorm';
import Setting from '../firestore/setting';
import { CreateEventDto } from './dto/create-event.dto';
import { Answer, EventDetail, ResponseEventDto } from './dto/read-event.dto';
import { ResponseEventListDto } from './dto/response-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { getFirestore } from 'firebase-admin/firestore';
import { Query } from '@google-cloud/firestore';
import Event from 'src/firestore/event';
import { LineService } from 'src/line/line.service';
import { CreateLineMessageDto } from 'src/line/dto/create-lineMessage';

@Injectable()
export class EventsService {
  constructor(@Inject('LINE') private readonly lineService: LineService) {}

  /**
   * イベントを作成して、LINEで通知する
   * @param createEventDto イベント情報
   * @returns
   */
  async create(userId: string, createEventDto: CreateEventDto) {
    const settingRepository = getRepository(Setting);
    const record = await settingRepository
      .whereEqualTo((Setting) => Setting.userFirebaseId, userId)
      .findOne();
    if (!record) {
      throw new Error('ユーザー取得失敗');
    }

    // LINE送信
    const dto: CreateLineMessageDto = new CreateLineMessageDto();
    dto.eventName = createEventDto.eventName;
    dto.leftButtonLabel = createEventDto.leftButtonLabel;
    dto.rightButtonLabel = createEventDto.rightButtonLabel;
    dto.message = createEventDto.message;
    this.lineService.sendBroadcastMessage(dto);

    // record.events.push({});

    const event = new Event();
    event.eventName = createEventDto.eventName;
    event.leftButtonLabel = createEventDto.leftButtonLabel;
    event.rightButtonLabel = createEventDto.rightButtonLabel;
    event.message = createEventDto.message;
    event.createdAt = new Date();
    await record.events.create(event);
  }

  /**
   * イベント一覧を取得する
   * @param userId 管理者FirebaseユーザーID
   * @returns イベント一覧
   */
  async findAll(userId: string): Promise<ResponseEventListDto> {
    const settingRepository = getRepository(Setting);
    const record = await settingRepository
      .whereEqualTo((Setting) => Setting.userFirebaseId, userId)
      .findOne();
    if (!record) {
      throw new Error('ユーザー取得失敗');
    }

    const events = await record.events.find();
    const res = new ResponseEventListDto();
    res.events = events.map((event) => ({
      eventName: event.eventName,
      eventID: event.id,
      createdAt: event.createdAt,
    }));
    return res;
  }

  /**
   * 個別イベント情報を取得する
   * @param userId 管理者FirebaseユーザーID
   * @param eventId イベントID
   * @returns イベント情報
   */
  async findOne(userId: string, eventId: string): Promise<ResponseEventDto> {
    /* --------------------------------------------------------------------------
     * DBデータ取得
     * -------------------------------------------------------------------------- */
    const settingRepository = getRepository(Setting);
    const record = await settingRepository
      .whereEqualTo((Setting) => Setting.userFirebaseId, userId)
      .findOne();
    if (!record) {
      throw new Error('ユーザー取得失敗');
    }

    const event = await record.events.findById(eventId);
    if (!event) {
      throw new Error('イベント取得失敗');
    }

    const answers = await event.answers.find();

    /* --------------------------------------------------------------------------
     * データ整形
     * -------------------------------------------------------------------------- */
    const dto = new ResponseEventDto();
    const dtoEvent = new EventDetail();
    dto.event = dtoEvent;
    if (answers.length === 0) {
      return dto;
    }

    dtoEvent.message = event.message;
    dtoEvent.leftButtonLabel = event.leftButtonLabel;
    dtoEvent.rightButtonLabel = event.rightButtonLabel;
    dtoEvent.answers = answers.map((answer) => {
      const dtoAnswer = new Answer();
      dtoAnswer.Attendance = answer.answer;
      dtoAnswer.userName = answer.userName;
      dtoAnswer.date = answer.createdAt;
      return dtoAnswer;
    });
    return dto;
  }
}
