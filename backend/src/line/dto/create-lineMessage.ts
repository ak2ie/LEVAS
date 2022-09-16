import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty } from 'class-validator';
export class CreateLineMessageDto {
  /**
   * メッセージ
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  message: string;

  /**
   * LINE 左側ボタンラベル名
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  leftButtonLabel: string;

  /**
   * LINE 右側ボタンラベル名
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  rightButtonLabel: string;

  eventName: string;
}
