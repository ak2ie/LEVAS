import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsEmpty,
} from 'class-validator';

/**
 * LINE イベント送信元情報
 */
export class LINESource {
  /**
   * 送信元種別
   */
  @ApiProperty({
    description: '送信元種別',
    examples: [{ summary: 'ユーザー', value: 'user' }],
  })
  type: string;

  /**
   * 送信元ユーザーID
   */
  @ApiProperty({
    description: '送信元ユーザーID',
  })
  userId: string;

  /**
   * 送信元グループトークのグループID
   */
  @ApiPropertyOptional({
    description: '送信元グループトークのグループID',
  })
  groupId?: string;

  /**
   * 送信元複数人トークのトークルームID
   */
  @ApiPropertyOptional({
    description: '送信元複数人トークのトークルームID',
  })
  roomId?: string;
}

/**
 * ポストバックイベント
 */
export class PostbackEvent {
  /**
   * ポストバックデータ
   */
  @IsString()
  @ApiProperty({
    description: 'ポストバックデータ',
  })
  data: string;
}

/**
 * LINE イベントタイプ識別子リスト
 */
const LINE_EVENT_TYPE = {
  /**
   * メッセージ受信
   */
  Message: 'message',
  /**
   * メッセージ内ボタン押下（ポストバック）
   */
  postback: 'postback',
  /**
   * 友だち登録
   */
  follow: 'follow',
  /**
   * 友だち解除
   */
  unfollow: 'unfollow',
} as const;

/**
 * LINE イベントタイプ識別子
 */
export type LINEEventType =
  typeof LINE_EVENT_TYPE[keyof typeof LINE_EVENT_TYPE];

/**
 * LINE Webhook イベント
 */
export class LINEEvent {
  /**
   * イベントのタイプを表す識別子
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'イベントのタイプを表す識別子',
  })
  type: LINEEventType | string;

  /**
   * イベントの発生時刻（ミリ秒）
   */
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'イベントの発生時刻（ミリ秒）',
  })
  timestamp: number;

  /**
   * 送信元情報
   */
  @ApiProperty({
    description: '送信元情報',
    type: LINESource,
  })
  source: LINESource;

  /**
   * ポストバックデータ
   */
  @ApiPropertyOptional({
    description: 'ポストバックデータ',
    type: PostbackEvent,
  })
  postback?: PostbackEvent;
}

/**
 * LINE Webhook リクエストボディ
 */
export class CreateLineDto {
  /**
   * LINE ユーザーID
   */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'LINE ユーザーID',
  })
  destination: string;

  /**
   * Webhookイベント（空配列の場合あり）
   */
  @IsArray()
  @IsEmpty()
  @ApiProperty({
    description: 'Webhookイベント（空配列の場合あり）',
    type: LINEEvent,
  })
  events: Array<LINEEvent>;
}
