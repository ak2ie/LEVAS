import { ApiProperty, ApiResponse } from '@nestjs/swagger';

export class EventItem {
  /**
   * イベントID
   */
  @ApiProperty({
    description: 'イベントID',
  })
  eventID: string;

  /**
   * イベント名
   */
  @ApiProperty({
    description: 'イベント名',
  })
  eventName: string;

  /**
   * 作成日時
   */
  @ApiProperty({
    description: '作成日時',
  })
  createdAt: Date;
}

export class ResponseEventListDto {
  constructor() {
    this.events = [];
  }

  /**
   * イベント一覧
   */
  @ApiProperty({
    description: 'イベント一覧',
    type: EventItem,
    isArray: true,
    // example: [
    //   {
    //     eventID: 'eventId1',
    //     eventName: 'イベント名1',
    //     createdAt: new Date(2022, 5, 10),
    //   },
    //   {
    //     eventID: 'eventId2',
    //     eventName: 'イベント名2',
    //     createdAt: new Date(2022, 5, 14),
    //   },
    // ],
  })
  events: Array<EventItem>;
}
