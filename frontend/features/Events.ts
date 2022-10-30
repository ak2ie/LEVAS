export interface EventItem {
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
}

export class EventList {
  constructor() {
    this.events = [];
  }

  /**
   * イベント一覧
   */
  events: EventItem[];
}
