# LEVAS フロントエンド

# 環境

- Next.js

- React Hook Form

- MUI

# 開発

```bash
# 初回のみ
$ yarn
```

## バックエンドの指定

### Firebase エミュレータを使用する場合

開発環境内でデータを作成・保存する。

```text
// .env.development

// モックサーバをコメント解除し、FIrebaseエミュレータをコメントアウトする

# API エンドポイント（Firebase エミュレータ）
#NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5001/levas-1297e/asia-northeast1/api
# API エンドポイント（モックサーバー）
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:4010/
```

### モックサーバを使用する場合

開発環境内で固定データを返すモックサーバを利用する。

    // .env.development

    // FIrebaseエミュレータをコメント解除し、モックサーバをコメントアウトする。

    # API エンドポイント（Firebase エミュレータ）
    NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5001/levas-1297e/asia-northeast1/api
    # API エンドポイント（モックサーバー）
    #NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:4010/

## 開発環境起動

```bash
# levasフォルダ直下で実行
$ pwd
***/levas

# Firebaseエミュレータ（モックサーバ利用の場合も、ユーザ認証のため起動が必要）
$ firebase emulators:start --import ./firebaseEmulator

# デバッグ実行
$ cd frontend
$ yarn dev

# テスト用ユーザー
# ID:test@example.com
# PASSWORD:123456
```
