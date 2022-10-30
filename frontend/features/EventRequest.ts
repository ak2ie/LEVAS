/**
 * イベント作成リクエスト
 */
export interface EventRequest {
  /**
   * LINE 送信テキスト
   */
  message: string;

  /**
   * LINE 左側ボタンラベル名
   */
  leftButtonLabel: string;

  /**
   * LINE 右側ボタンラベル名
   */
  rightButtonLabel: string;

  /**
   * イベント名
   */
  eventName: string;
}
