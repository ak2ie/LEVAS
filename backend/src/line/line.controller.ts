import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
  Inject,
  UsePipes,
  ValidationPipe,
  Get,
} from '@nestjs/common';
import { LineService } from './line.service';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LINEAuthGuard } from 'src/auth/line.guard';
import { Client } from '@line/bot-sdk';
import { getRepository } from 'fireorm';
import Setting from 'src/firestore/setting';
import { CreateLineDto } from './dto/create-line.dto';
import { CreateLineMessageDto } from './dto/create-lineMessage';
import { FirebaseAuthGuard } from 'src/auth/firebase.guard';
import { CreateLineTokenDto } from './dto/create-lineToken';

@ApiTags('LINE')
@Controller('line')
@ApiBearerAuth()
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
    description: 'LINEサーバーから呼び出される',
  })
  async findAll(
    @Body() body: CreateLineDto,
  ): Promise<{ [key: string]: string }> {
    // await this.lineService.sendBroadcastMessage(body);
    return { 'This action returns all cats': '' };
  }
}
