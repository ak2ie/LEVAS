import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { LineGuard } from 'src/guards/line.guards';
import { LineService } from './line.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('LINE')
@Controller('line')
// @UseGuards(LineGuard)
export class LineController {
  constructor(private readonly lineService: LineService) {}

  /**
   * ユーザーからのメッセージの送信時などに、LINEプラットフォームから呼び出される
   */
  @Post('webhook')
  @HttpCode(200)
  async findAll(@Body() body: string): Promise<{ [key: string]: string }> {
    await this.lineService.sendBroadcastMessage('body');
    return { 'This action returns all cats': '' };
  }
}
