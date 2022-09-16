import { Collection } from 'fireorm';
import Event from './event';
import User from './user';

@Collection()
export default class Setting {
  id!: string;
  /**
   * LINE チャネルID
   */
  channelID: string;
  /**
   * LINE チャネルシークレット
   */
  channelSecret: string;
  /**
   * LINE アクセストークン
   */
  accessToken: string;
  /**
   * Firebase ユーザーID
   */
  userId: string;
  users: Array<User>;
  events: Array<Event>;
  createdAt: Date;
}
