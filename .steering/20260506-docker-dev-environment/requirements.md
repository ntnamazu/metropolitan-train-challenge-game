# 要求内容

## 概要

`docs/architecture.md` の「開発環境構成」セクションに定義されたDocker開発環境を実装する。`docker compose up` で開発環境が起動できるようにする。

## 背景

アーキテクチャ設計書にDockerを使った開発環境構成が定義されているが、実際のファイルが存在しない。チーム全体で一貫した開発環境を使えるようにするために実装が必要。

## 実装対象の機能

### 1. Dockerfile（マルチステージビルド）
- `base`, `deps`, `development`, `builder`, `production` の5ステージ構成
- Node.js v24.11.0-alpine ベースイメージ
- 非rootユーザー（nodejs）で実行（セキュリティ対策）
- 開発ステージ: Vite dev server起動
- 本番ステージ: nginx で静的ファイル配信（SPAルーティング対応）

### 2. docker-compose.yml（開発環境）
- ポート5173でVite dev serverを公開
- ボリュームマウントでホットリロード対応（`/app/node_modules`は除外）
- `.env.development` を環境変数ファイルとして使用

### 3. docker-compose.prod.yml（本番環境相当の検証）
- ポート8080でnginxを公開
- `.env.production` を環境変数ファイルとして使用

### 4. 環境変数管理
- `.env.example` テンプレートをgit管理
- `.env.development` と `.env.production` は.gitignore対象
- `.gitignore` を更新して環境変数ファイルを除外

## 受け入れ条件

### Dockerfile
- [ ] マルチステージビルドが正しく定義されている
- [ ] 非rootユーザーで実行される
- [ ] `development` ターゲットでVite dev serverが起動する
- [ ] `production` ターゲットでnginxが起動しSPAルーティングに対応する

### docker-compose.yml
- [ ] ファイルが存在し、構文が正しい
- [ ] ポート5173でアクセス可能な設定になっている
- [ ] ボリュームマウントが正しく設定されている

### docker-compose.prod.yml
- [ ] ファイルが存在し、構文が正しい
- [ ] ポート8080でアクセス可能な設定になっている

### 環境変数管理
- [ ] `.env.example` が存在し、必要な変数が定義されている
- [ ] `.gitignore` に `.env.development` と `.env.production` が追加されている

## スコープ外

以下はこのフェーズでは実装しません:

- CI/CDパイプラインの設定（`.github/workflows/`）
- Lighthouse CI設定
- 実際のDockerビルドの実行（ファイル作成のみ）

## 参照ドキュメント

- `docs/architecture.md` - アーキテクチャ設計書（開発環境構成セクション、デプロイメント戦略セクション）
