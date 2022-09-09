# LEVAS

LINE を使ってイベントの開催通知、参加登録を管理するシステム。

# 機能

- 公式アカウント登録
- 開催通知
- 参加登録
- 申込状況管理
- ユーザー管理
- アクセストークン管理

# 用語

| 名前                   | 説明                                                       | 備考 |
| ---------------------- | ---------------------------------------------------------- | ---- |
| 管理者 LINE アカウント | イベントの開催通知をおこなう LINE 公式アカウント           |      |
| 友だち                 | 管理者 LINE アカウントを友だち登録している LINE アカウント |      |

# 公式アカウント登録

ユーザーの管理者 LINE アカウントを登録する。

LEVAS に新規登録した場合、ユーザーは以下の内容を登録する。（チャネル ID・シークレット登録 API）

- LINE チャネル ID
- チャネルシークレット

アクセストークン管理の発行を呼び出す。

# 開催通知

管理者 LINE アカウントの全友だちアカウントにイベントの開催を通知する。

ユーザーは、以下の内容を入力する。

- 本文：LINE で送信するテキスト
- イベント名：本システムで表示する管理用の名前

ユーザーが送信ボタンをクリックすると、確認ダイアログを表示する。
OK をクリックした場合は、[ブロードキャストメッセージ](https://developers.line.biz/ja/reference/messaging-api/#send-broadcast-message)を送信する。（ブロードキャストメッセージ
送信 API）
イベント ID を採番する。

```
{
	type: 'template',
	altText: <LINE 送信テキスト>,
	template: {
		type: 'confirm',
		text: <LINE 送信テキスト>,
		actions: [
		{
			type: 'postback',
			label: <LINE 左側ボタンラベル名>,
			data: '{eventID:<イベントID>, answer:"left"}',
			displayText: '送信しました',
		},
		{
			type: 'postback',
			label: <LINE 右側ボタンラベル名>,
			data: '{eventID:<イベントID>, answer:"right"}',
			displayText: '送信しました',
		},
		],
	},
}
```

システムに以下の内容を保存する。

- イベント ID
- イベント名
- 本文

# 参加登録

友だちアカウントから参加登録が実行されたらシステムに登録する。（参加登録 API）

友だちアカウントが LINE メッセージのボタンをクリックして[ポストバックイベント](https://developers.line.biz/ja/reference/messaging-api/#postback-event)を送信する。

Webhook イベントを受信して、`type`が`postback`の場合、処理を継続する。

`destination`から登録対象の管理者 LINE アカウントを特定する。

`source`の`userId`から友だちを取得する。

`postback`の`data`から以下の情報を取得する。

- eventId：イベント ID
- answer：参加可否（yes：参加、no：不参加）

# 申込状況管理

## イベント一覧

ユーザーが登録済のイベント一覧を表示する。

ユーザーが登録した全イベントを取得し、登録日の降順で表示する。（イベント一覧取得 API）

## 個別イベント申込状況表示

個別のイベントについて参加可否を返答したユーザー一覧を表示する。

参加可否を返答したユーザーについて、以下の情報を表示する。（個別イベント取得 API）

- 名前
- 参加可否

LINE の本文を表示する。

# 友だち管理

友だち情報を管理する。

友だちについて、以下の内容を編集できる。（友だち更新 API）

- 名前
- メモ

# 友だち登録・解除

管理者 LINE アカウントを友だち登録・解除した場合にシステムの登録状況を変更する。

## 友だち登録

`type`が`follow`である[フォローイベント](https://developers.line.biz/ja/reference/messaging-api/#follow-event)を受信した場合、システムに登録する。

`destination`から登録対象の管理者 LINE アカウントを特定する。

`source`の`userId`からユーザー ID を取得する。

ユーザー ID を用いて[プロフィール情報](https://developers.line.biz/ja/reference/messaging-api/#users)を取得する。
プロフィール情報の`displayName`からユーザー名を取得する。

システムに以下の情報を登録する。

- ユーザー ID
- ユーザー名
- ステータス：有効

## 友だち解除

`type`が`unfollow`である[フォロー解除イベント](https://developers.line.biz/ja/reference/messaging-api/#unfollow-event)を受信した場合、システムに登録する。

`destination`から登録対象の管理者 LINE アカウントを特定する。

`source`の`userId`からユーザー ID を取得する。

システムで当該ユーザーのステータスを無効に更新する。

# アクセストークン管理

LINE Messaging API のアクセストークンを管理する

## 取得

システム内に保存しているアクセストークンを取得する。（アクセストークン取得 API）

## 発行

アクセストークンを発行する。

[短期のチャネルアクセストークン](https://developers.line.biz/ja/reference/messaging-api/#issue-shortlived-channel-access-token)を発行する。（アクセストークン発行 API）

アクセストークンを保存する。

# DB

## ユーザー

| 物理名        | 論理名               | 備考 |
| ------------- | -------------------- | ---- |
| channelID     | チャネル ID          |      |
| channelSecret | チャネルシークレット |      |
| accessToken   | アクセストークン     |      |
| users         | 友だち一覧           |      |
| events        | イベント一覧         |      |

## 友だち

| 物理名    | 論理名      | 備考 |
| --------- | ----------- | ---- |
| lineID    | LINE ID     |      |
| userID    | ユーザー ID |      |
| userName  | ユーザー名  |      |
| memo      | メモ        |      |
| createdAt | 登録日      |      |

## イベント

| 物理名           | 論理名                  | 備考 |
| ---------------- | ----------------------- | ---- |
| eventID          | イベント ID             |      |
| eventName        | イベント名              |      |
| message          | LINE 送信テキスト       |      |
| leftButtonLabel  | LINE 左側ボタンラベル名 |      |
| rightButtonLabel | LINE 右側ボタンラベル名 |      |
| createdAt        | イベント作成日          |      |
| answers          | 参加可否一覧            |      |

### 参加可否一覧

| 物理名    | 論理名      | 備考              |
| --------- | ----------- | ----------------- |
| userID    | ユーザー ID |                   |
| userName  | ユーザー名  |                   |
| answer    | 参加可否    | `left` or `right` |
| createdAt | 登録日      |                   |
