import { Collection } from 'fireorm';
import Answer from './answer';
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
   * ユーザーID
   */
  userId: string;
  users: Array<User>;
  events: Array<Answer>;
  createdAt: Date;
}
