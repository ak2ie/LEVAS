import { Injectable } from '@nestjs/common';
import { Client, middleware } from '@line/bot-sdk';
import { ConfigService } from '@nestjs/config';

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
  async sendBroadcastMessage(test: string) {
    console.log(test);
    return 'OK';
  }
}
