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
  })
  message: string;

  /**
   * LINE 左側ボタンラベル名
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'LINE 左側ボタンラベル名',
  })
  leftButtonLabel: string;

  /**
   * LINE 右側ボタンラベル名
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'LINE 右側ボタンラベル名',
  })
  rightButtonLabel: string;

  /**
   * イベント名
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'イベント名',
  })
  eventName: string;
}
