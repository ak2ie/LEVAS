export interface ReponseFriendItem {
  /**
   * ユーザー ID
   */
  userID: string;

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
   * LINE表示名
   */
  lineUserName: string;
}

export interface ReponseFriend {
  friends: Array<ReponseFriendItem>;
}
