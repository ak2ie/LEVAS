import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { LineService } from './line.service';
import { ApiTags } from '@nestjs/swagger';
import { LINEAuthGuard } from 'src/auth/line.guard';

@ApiTags('LINE')
@Controller('line')
@UseGuards(LINEAuthGuard)
export class LineController {
  constructor(private readonly lineService: LineService) {}

  /**
   * ユーザーからのメッセージの送信時などに、LINEプラットフォームから呼び出される
   */
  @Post('webhook')
  @HttpCode(200) // LINEのルールにより200を返す必要あり
  async findAll(@Body() body: string): Promise<{ [key: string]: string }> {
    await this.lineService.sendBroadcastMessage('body');
    return { 'This action returns all cats': '' };
  }
}
