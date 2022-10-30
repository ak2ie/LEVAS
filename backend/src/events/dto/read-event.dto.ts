import { IsString, IsNotEmpty, isArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventItem } from './response-events.dto';

/**
 * イベント回答
 */
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

/**
 * イベント詳細
 */
export class EventDetail {
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
    type: Answer,
    isArray: true,
  })
  answers: Array<Answer>;
}

/**
 * 個別イベントレスポンス
 */
export class ResponseEventDto {
  /**
   * イベント詳細
   */
  @ApiProperty({
    description: 'イベント詳細',
    type: EventDetail,
  })
  event: EventDetail;
}
