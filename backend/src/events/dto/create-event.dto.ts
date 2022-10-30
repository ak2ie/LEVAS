import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateEventDto {
  /**
   * LINE 送信テキスト
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'LINE 送信テキスト',
    maxLength: 240, // https://developers.line.biz/ja/reference/messaging-api/#confirm
  })
  message: string;

  /**
   * LINE 左側ボタンラベル名
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'LINE 左側ボタンラベル名',
    maxLength: 20, // https://developers.line.biz/ja/reference/messaging-api/#postback-action
  })
  leftButtonLabel: string;

  /**
   * LINE 右側ボタンラベル名
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'LINE 右側ボタンラベル名',
    maxLength: 20, // https://developers.line.biz/ja/reference/messaging-api/#postback-action
  })
  rightButtonLabel: string;

  /**
   * イベント名
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'イベント名',
    maxLength: 100,
  })
  eventName: string;
}
