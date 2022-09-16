import { IsString, IsNotEmpty, isArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Answer {
  /**
   * ユーザー名
   */
  @ApiProperty({
    description: 'ユーザー名',
  })
  userName: string;

  /**
   * 出席可否
   */
  @ApiProperty({
    description: '出席可否',
  })
  Attendance: string;

  /**
   * 登録日時
   */
  @ApiProperty({
    description: '登録日時',
    type: Date,
  })
  date: Date;
}

export class ResponseEventDto {
  /**
   * LINE 送信テキスト
   */
  @ApiProperty({
    description: 'LINE 送信テキスト',
    example: 'イベントに参加しますか？',
  })
  message: string;

  /**
   * LINE 左側ボタンラベル名
   */
  @ApiProperty({
    description: 'LINE 左側ボタンラベル名',
    example: '参加する',
  })
  leftButtonLabel: string;

  /**
   * LINE 右側ボタンラベル名
   */
  @ApiProperty({
    description: 'LINE 右側ボタンラベル名',
    example: '参加しない',
  })
  rightButtonLabel: string;

  /**
   * 出席一覧
   */
  @ApiProperty({
    description: '出席一覧',
    type: [Answer],
    example: [
      {
        userName: 'ユーザーA',
        Attendance: '参加しない',
        date: new Date(2022, 5, 4),
      },
      {
        userName: 'ユーザーB',
        Attendance: '参加する',
        date: new Date(2022, 5, 6),
      },
      {
        userName: 'ユーザーC',
        Attendance: '参加する',
        date: new Date(2022, 5, 10),
      },
    ],
  })
  answers: Array<Answer>;
}
