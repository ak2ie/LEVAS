import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFriendDto {
  /**
   * ユーザー ID
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ユーザーID',
  })
  userID: string;

  /**
   * ユーザー名
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ユーザー名',
    maxLength: 100,
  })
  userName: string;

  /**
   * メモ
   */
  @IsString()
  @ApiProperty({
    description: 'メモ',
    maxLength: 500,
  })
  memo: string;
}
