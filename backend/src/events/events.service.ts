import { Injectable } from '@nestjs/common';
import { getRepository } from 'fireorm';
import Setting from '../firestore/setting';
import { CreateEventDto } from './dto/create-event.dto';
import { ResponseEventDto } from './dto/read-event.dto';
import { ResponseEventListDto } from './dto/response-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  /**
   * イベントを作成して、LINEで通知する
   * @param createEventDto イベント情報
   * @returns
   */
  async create(userId: string, createEventDto: CreateEventDto) {
    const settingRepository = getRepository(Setting);
    const record = await settingRepository
      .whereEqualTo((Setting) => Setting.userId, userId)
      .findOne();
    if (!record) {
      throw new Error('ユーザー取得失敗');
    }

    // TODO: LINE送信

    record.events.push({});

    settingRepository.update(record);
  }

  /**
   * イベント一覧を取得する
   * @param userId 管理者FirebaseユーザーID
   * @returns イベント一覧
   */
  async findAll(userId: string): Promise<ResponseEventListDto> {
    const settingRepository = getRepository(Setting);
    const record = await settingRepository
      .whereEqualTo((Setting) => Setting.userId, userId)
      .findOne();
    if (!record) {
      throw new Error('ユーザー取得失敗');
    }
    const res = new ResponseEventListDto();
    record.events.map((event) => {
      res.events.push({
        eventID: event.eventID,
        eventName: event.eventName,
        createdAt: event.createdAt,
      });
    });
    return res;
  }

  /**
   * 個別イベント情報を取得する
   * @param userId 管理者FirebaseユーザーID
   * @param eventId イベントID
   * @returns イベント情報
   */
  async findOne(userId: string, eventId: string): Promise<ResponseEventDto> {
    const settingRepository = getRepository(Setting);
    const record = await settingRepository
      .whereEqualTo((Setting) => Setting.userId, userId)
      .findOne();
    if (!record) {
      throw new Error('ユーザー取得失敗');
    }

    const event = record.events.filter((event) => event.eventID === eventId);
    if (event.length === 0) {
      throw new Error('イベント取得失敗');
    }
    const dto = new ResponseEventDto();
    dto.message = event[0].message;
    dto.leftButtonLabel = event[0].leftButtonLabel;
    dto.rightButtonLabel = event[0].rightButtonLabel;
    dto.answers = event[0].answers.map((answer) => {
      return {
        Attendance: answer.answer,
        userName: answer.userName,
        date: answer.createdAt,
      };
    });
    return dto;
  }
}
