import { Injectable } from '@nestjs/common';
import { Client, middleware, HTTPError } from '@line/bot-sdk';
import { ConfigService } from '@nestjs/config';
import { WebhookEvent } from './webhookEvent';

@Injectable()
export class LineService {
  /**
   * LINE Client
   */
  private client: Client;

  constructor(private configService: ConfigService) {
    const config = {
      channelAccessToken: this.configService.get<string>(
        'ENV_LINE_CHANNEL_ACCESS_TOKEN',
      ),
      channelSecret: this.configService.get<string>('ENV_LINE_CHANNEL_SECRET'),
    };

    this.client = new Client(config);
    middleware(config);
  }

  /**
   * 全員にメッセージ送信
   */
  async sendBroadcastMessage(text: string) {
    return 'OK';
  }

  /**
   * ユーザーから受信したメッセージ処理
   */
  async receiveMessageHander(events: WebhookEvent) {
    return events.message;
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
