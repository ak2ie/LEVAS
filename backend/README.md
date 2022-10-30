# LEVAS バックエンド

# 開発

```
# 初回のみ
$ yarn

# 開発
$ yarn start:debug
```

## API ドキュメント

OpenAPI の仕様書を表示する。

```bash
$ yarn run start

# ブラウザで以下のURLを開くと表示される
# http://localhost:3000/api
```

## モックサーバ

```bash
# Swaggerを起動しておく
$ yarn start

# 別ターミナルで、API定義をJSONに出力
$ curl http://localhost:3000/api-json > spec.json

# ここで、Swaggerは停止してOK

# モックAPIサーバを起動
$ yarn mock
```
