# LEVAS

LINE でイベントの開催通知、参加登録ができるシステムです。

## 環境

### フロントエンド

- Next.js

### バックエンド

- NestJS
- LINE SDK

### 共通

- TypeScript
- Node.js
- Firebase

## システム構成

フロントエンド <=> バックエンド <=> LINE

## 使い方

### インストール

- フロントエンド

```bash
$ cd frontend
$ yarn install
```

- バックエンド

```bash
$ cd backend
$ yarn install
```

- Firebase

```json
// .firebaserc
{
  "projects": {
    "default": "<プロジェクトID>"
  }
}

// frontend/.env
apiKey=
authDomain=
projectId=
storageBucket=
messagingSenderId=
appId=
measurementId=

// backend/.env
ENV_FIREBASE_PROJECT_ID=<>
ENV_FIREBASE_PRIVATE_KEY=<>
ENV_FIREBASE_CLIENT_EMAIL=<>
```

### 開発

#### Firebase エミュレータ

```bash
# エミュレータ起動 (levasフォルダ直下で実行)
$ firebase emulators:start --import ./firebaseEmulator
```

エミュレータのデータ（ユーザー、DB）をエクスポートするには以下のコマンドを実行する。

```bash
# エミュレータデータエクスポート (levasフォルダ直下で実行)
$ firebase emulators:export ./firebaseEmulator
```

### デプロイ

- フロントエンド

```bash
$ cd frontend
$ yarn run deploy
```

- バックエンド

```bash
$ cd backend
$ yarn run deploy
```

## ライセンス

MIT
