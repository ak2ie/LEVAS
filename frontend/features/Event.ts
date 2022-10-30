export interface Answer {
  /**
   * ユーザー名
   */
  userName: string;

  /**
   * 出席可否
   */
  Attendance: string;

  /**
   * 登録日時
   */
  date: string;
}

export interface EventItemResponse {
  /**
   * イベントID
   */
  eventID: string;

  /**
   * イベント名
   */
  eventName: string;

  /**
   * 作成日時
   */
  createdAt: string;

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
   * 出席一覧
   */
  answers: Array<Answer>;
}

export interface EventResponse {
  event: EventItemResponse;
}
