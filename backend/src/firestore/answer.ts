import { Collection } from 'fireorm';

/**
 * 回答
 */
export default class Answer {
  id!: string;

  /**
   * ユーザーID
   */
  userFirebaseId: string;

  /**
   * ユーザー名
   */
  userName: string;

  /**
   * 回答
   */
  answer: string;

  /**
   * 作成日
   */
  createdAt: Date;
}
