import { Injectable, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  Client,
  middleware,
  HTTPError,
  LINE_REQUEST_ID_HTTP_HEADER_NAME,
} from '@line/bot-sdk';
import { ConfigService } from '@nestjs/config';
import { WebhookEvent } from './webhookEvent';
import { getRepository } from 'fireorm';
import Setting from '../firestore/setting';
import { CreateSettingDto } from 'src/setting/dto/create-setting.dto';
import { CreateLineDto, LINEEvent } from './dto/create-line.dto';
import { CreateLineMessageDto } from './dto/create-lineMessage';
import { CreateLineTokenDto } from './dto/create-lineToken';
import User from 'src/firestore/user';
import Event from 'src/firestore/event';
import Answer from 'src/firestore/answer';

@Injectable()
// @UsePipes(ValidationPipe)
export class LineService {
  /**
   * コンストラクタ
   * @param client LINE Client
   */
  constructor(private client: Client) {}

  /**
   * 全員にメッセージ送信
   */
  async sendBroadcastMessage(createLineMessageDto: CreateLineMessageDto) {
    await this.client.broadcast({
      type: 'template',
      altText: createLineMessageDto.message,
      template: {
        type: 'confirm',
        text: createLineMessageDto.message,
        actions: [
          {
            type: 'postback',
            label: createLineMessageDto.leftButtonLabel,
            data: '',
            displayText: '送信しました',
          },
          {
            type: 'postback',
            label: createLineMessageDto.rightButtonLabel,
            data: '',
            displayText: '送信しました',
          },
        ],
      },
    });
  }

  /**
   * ユーザーから受信したメッセージ処理
   */
  async receiveMessageHander(event: LINEEvent) {
    return event;
  }

  /**
   * イベント参加登録
   * @param lineId イベント管理者LINE ID
   * @param event 参加者LINE送信情報
   */
  async postbackHander(lineId: string, event: LINEEvent) {
    const settingRepository = getRepository(Setting);
    const record = await settingRepository
      .whereEqualTo((Setting) => Setting.channelID, lineId)
      .findOne();
    if (!record) {
      throw new Error('管理者ユーザー取得失敗');
    }
    const postBack = JSON.parse(event.postback.data);

    const eventRecord = await record.events
      .whereEqualTo((Event) => Event.id, postBack['eventID'])
      .findOne();
    if (!eventRecord) {
      throw new Error('参加対象のイベント取得失敗');
    }

    let user = await record.users
      .whereEqualTo((User) => User.lineID, event.source.userId)
      .findOne();
    if (!user) {
      await this.followHander(lineId, event);

      user = await record.users
        .whereEqualTo((User) => User.lineID, event.source.userId)
        .findOne();
    }

    const answer = new Answer();
    answer.answer = postBack['answer'];
    answer.userFirebaseId = user.id;
    answer.createdAt = new Date();
    await eventRecord.answers.update(answer);

    return event;
  }

  /**
   * 友だち登録
   */
  async followHander(lineId: string, event: LINEEvent) {
    const friendProfile = await this.client.getProfile(event.source.userId);

    const settingRepository = getRepository(Setting);
    const record = await settingRepository
      .whereEqualTo((Setting) => Setting.channelID, lineId)
      .findOne();
    if (!record) {
      throw new Error('ユーザー取得失敗');
    }

    const friend = new User();
    friend.lineID = event.source.userId;
    friend.userName = friendProfile.displayName;
    friend.lineUserName = friendProfile.displayName;
    friend.imgUrl = friendProfile.pictureUrl;
    friend.memo = '';
    friend.createdAt = new Date();
    await record.users.create(friend);
  }

  /**
   * 友だち解除
   */
  async unfollowHander(lineId: string, event: LINEEvent) {
    return event;
  }

  /**
   * LINEチャネルID・アクセストークンを保存する
   * @param createLineTokenDto
   */
  async saveToken(createLineTokenDto: CreateLineTokenDto) {
    const settingRepository = getRepository(Setting);
    const record = await settingRepository
      .whereEqualTo(
        (Setting) => Setting.channelID,
        createLineTokenDto.channelID,
      )
      .findOne();
    const setting = new Setting();
    setting.channelID = createLineTokenDto.channelID;
    setting.channelSecret = createLineTokenDto.channelSecret;
    setting.userFirebaseId = '';
    if (!record) {
      await settingRepository.create(setting);
    } else {
      await settingRepository.update(setting);
    }
  }

  async sample(text: string) {
    try {
      await this.client.broadcast({
        type: 'template',
        altText: text,
        template: {
          type: 'confirm',
          text: text,
          actions: [
            {
              type: 'postback',
              label: '参加', // ボタン
              //   text: '参加', // ボタン押下時に送信するテキスト
              data: '',
              displayText: '送信しました',
            },
            {
              type: 'postback',
              label: '不参加',
              //   text: '不参加',
              data: '',
              displayText: '送信しました',
            },
          ],
        },
      });

      await this.client.replyMessage('', {
        type: 'text',
        text: 'お返事できません',
      });
    } catch (err) {
      if (err instanceof HTTPError) {
        console.error(err.message);
      }
    }
  }
}
