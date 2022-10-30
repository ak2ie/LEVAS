import { Collection, ISubCollection, SubCollection } from 'fireorm';
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
  userFirebaseId: string;

  /**
   * ユーザー一覧
   */
  @SubCollection(User)
  users?: ISubCollection<User>;

  /**
   * イベント一覧
   */
  @SubCollection(Event)
  events?: ISubCollection<Event>;

  /**
   * 作成日
   */
  createdAt: Date;
}
