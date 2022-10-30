import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Inject,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LineService } from './line.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LINEAuthGuard } from 'src/auth/line.guard';
import { CreateLineDto, LINEEventType } from './dto/create-line.dto';

@ApiTags('LINE')
@Controller('line')
export class LineController {
  constructor(@Inject('LINE') private readonly lineService: LineService) {}

  /**
   * ユーザーからのメッセージの送信時などに、LINEプラットフォームから呼び出される
   */
  @Post('webhook')
  @HttpCode(200) // LINEのルールにより200を返す必要あり
  @UsePipes(ValidationPipe)
  @UseGuards(LINEAuthGuard)
  @ApiHeader({
    name: 'X-Line-Signature',
    description:
      'LINEプラットフォームから送信されたことを確認するための署名（x-line-signatureでも可）',
  })
  @ApiOperation({
    description: 'LINEからWebhookで呼び出される',
  })
  async findAll(@Body() body: CreateLineDto): Promise<void> {
    if (body.events.length === 0) {
      // 疎通確認用
      return;
    }

    for (const event of body.events) {
      switch (event.type) {
        // メッセージ受信
        case 'message':
          await this.lineService.receiveMessageHander(event);
          break;

        // メッセージ内ボタン押下
        case 'postback':
          await this.lineService.postbackHander(body.destination, event);
          break;

        // 友だち登録
        case 'follow':
          await this.lineService.followHander(body.destination, event);
          break;

        // 友だち解除
        case 'unfollow':
          await this.lineService.unfollowHander(body.destination, event);
          break;

        default:
          break;
      }
    }
    return;
  }
}
