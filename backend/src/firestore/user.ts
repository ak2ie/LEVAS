import { Collection } from 'fireorm';

/**
 * ユーザー
 */
export default class User {
  /**
   * ユーザーID
   */
  id!: string;

  /**
   * LINE ID
   */
  lineID: string;

  /**
   * LINE 表示名
   */
  lineUserName: string;

  /**
   * ユーザー名
   */
  userName: string;

  /**
   * メモ
   */
  memo: string;

  /**
   * アイコン画像URL
   */
  imgUrl: string;

  /**
   * 作成日
   */
  createdAt: Date;
}
