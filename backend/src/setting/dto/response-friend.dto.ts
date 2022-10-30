import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReponseFriendItem {
  /**
   * ユーザー ID
   */
  @ApiProperty({
    description: 'ユーザーID',
  })
  userID: string;

  /**
   * ユーザー名
   */
  @ApiProperty({
    description: 'ユーザー名',
  })
  userName: string;

  /**
   * メモ
   */
  @ApiProperty({
    description: 'メモ（未設定なら空文字）',
  })
  memo: string;

  /**
   * アイコン画像URL
   */
  @ApiProperty({
    description: 'アイコン画像URL（未設定なら空文字）',
  })
  imgUrl: string;

  /**
   * LINE表示名
   */
  @ApiProperty({
    description: 'LINE表示名',
  })
  lineUserName: string;
}

export class ReponseFriendDto {
  @ApiProperty({
    description: '友だち一覧',
    isArray: true,
    type: ReponseFriendItem,
  })
  friends: Array<ReponseFriendItem>;
}
