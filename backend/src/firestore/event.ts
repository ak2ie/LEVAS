import { Collection, ISubCollection, SubCollection } from 'fireorm';
import Answer from './answer';

/**
 * イベント
 */
export default class Event {
  id!: string;

  /**
   * イベント名
   */
  eventName: string;

  /**
   * LINE 送信メッセージ
   */
  message: string;

  /**
   * LINE 送信メッセージ 左側ボタン名
   */
  leftButtonLabel: string;

  /**
   * LINE 送信メッセージ 右側ボタン名
   */
  rightButtonLabel: string;

  /**
   * 作成日
   */
  createdAt: Date;

  /**
   * 回答
   */
  @SubCollection(Answer)
  answers?: ISubCollection<Answer>;
}
