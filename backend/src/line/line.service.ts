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
import { CreateLineDto } from './dto/create-line.dto';
import { CreateLineMessageDto } from './dto/create-lineMessage';
import { CreateLineTokenDto } from './dto/create-lineToken';

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
    // await this.client.broadcast({
    //   type: 'template',
    //   altText: createLineMessageDto.message,
    //   template: {
    //     type: 'confirm',
    //     text: createLineMessageDto.message,
    //     actions: [
    //       {
    //         type: 'postback',
    //         label: createLineMessageDto.leftButtonLabel,
    //         data: '',
    //         displayText: '送信しました',
    //       },
    //       {
    //         type: 'postback',
    //         label: createLineMessageDto.rightButtonLabel,
    //         data: '',
    //         displayText: '送信しました',
    //       },
    //     ],
    //   },
    // });
    return 'OK';
  }

  /**
   * ユーザーから受信したメッセージ処理
   */
  async receiveMessageHander(events: WebhookEvent) {
    return events.message;
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
    setting.userId = '';
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
