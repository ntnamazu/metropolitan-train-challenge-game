# 設計書

## アーキテクチャ概要

マルチステージDockerビルドを採用し、開発・本番で同一のDockerfileから異なるイメージを生成する。

```
Dockerfile (マルチステージ)
├── base          → Node.js 24.11.0-alpine, 非rootユーザー設定
├── deps          → npm ci で依存関係インストール
├── development   → dev server起動 (docker-compose.yml で使用)
├── builder       → npm run build でViteビルド
└── production    → nginx でビルド済み静的ファイルを配信 (docker-compose.prod.yml で使用)
```

## コンポーネント設計

### 1. Dockerfile

**責務**:
- 全環境共通のベースイメージ定義
- 依存関係のキャッシュ最適化（package*.json を先にコピー）
- セキュリティ: 非rootユーザー（nodejs, uid=1001）で実行

**実装の要点**:
- `base` ステージで非rootユーザーを作成
- `deps` ステージで `npm ci` を実行（キャッシュ効率化）
- `development` ステージでは `chown -R nodejs:nodejs /app` 後にユーザー切り替え
- `production` ステージは nginx:alpine ベース、SPAルーティングのため `try_files $uri $uri/ /index.html`

### 2. docker-compose.yml（開発環境）

**責務**:
- 開発時のコンテナ起動設定
- ホットリロードのためのボリュームマウント

**実装の要点**:
- `target: development` でDockerfileの開発ステージを指定
- `. :/app` でソースコードをマウント（変更を即反映）
- `/app/node_modules` を除外ボリュームとして設定（ホストのnode_modulesを使わない）
- `--host 0.0.0.0` でコンテナ外からアクセス可能に

### 3. docker-compose.prod.yml（本番環境相当）

**責務**:
- 本番ビルドの動作確認環境

**実装の要点**:
- `target: production` でnginxステージを使用
- `--build` フラグ付きで起動することを想定

### 4. 環境変数ファイル

**責務**:
- 環境別設定の管理

**実装の要点**:
- `.env.example`: テンプレート（git管理）、`VITE_API_URL` と `VITE_ENV` を定義
- `.env.development`: 実際の開発設定（git管理外）
- `.env.production`: 実際の本番設定（git管理外）

## ディレクトリ構造

```
/（プロジェクトルート）
├── Dockerfile                # 新規作成
├── docker-compose.yml        # 新規作成
├── docker-compose.prod.yml   # 新規作成
├── .env.example              # 新規作成
├── .env.development          # 新規作成（gitignore対象）
├── .env.production           # 新規作成（gitignore対象）
└── .gitignore                # 更新（.env.development, .env.production を追加）
```

## 実装の順序

1. Dockerfile の作成
2. docker-compose.yml の作成
3. docker-compose.prod.yml の作成
4. .env.example の作成
5. .env.development の作成
6. .env.production の作成
7. .gitignore の更新

## セキュリティ考慮事項

- 非rootユーザーでコンテナ実行（UID 1001）
- `.env.development` と `.env.production` はgit管理外（機密情報保護）
- node:24.11.0-alpine を使用（最小限のイメージサイズ）

## パフォーマンス考慮事項

- `package*.json` を先にコピーしてnpmキャッシュを最大化
- `/app/node_modules` を除外ボリュームとして設定（パフォーマンス向上）
- alpine ベースで最小限のイメージサイズ
