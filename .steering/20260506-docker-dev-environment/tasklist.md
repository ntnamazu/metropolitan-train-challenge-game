# タスクリスト

## 🚨 タスク完全完了の原則

**このファイルの全タスクが完了するまで作業を継続すること**

### 必須ルール
- **全てのタスクを`[x]`にすること**
- 「時間の都合により別タスクとして実施予定」は禁止
- 「実装が複雑すぎるため後回し」は禁止
- 未完了タスク（`[ ]`）を残したまま作業を終了しない

---

## フェーズ1: Dockerファイルの作成

- [x] Dockerfile を作成する
  - [x] `base` ステージ: node:24.11.0-alpine、非rootユーザー作成
  - [x] `deps` ステージ: package*.json コピー + npm ci
  - [x] `development` ステージ: node_modules コピー、chown、ユーザー切替、EXPOSE 5173
  - [x] `builder` ステージ: npm run build 実行
  - [x] `production` ステージ: nginx:alpine、SPAルーティング設定、EXPOSE 80

- [x] docker-compose.yml を作成する
  - [x] `app` サービス定義
  - [x] `target: development` 指定
  - [x] ポート 5173:5173 マッピング
  - [x] ボリュームマウント（`. :/app`, `/app/node_modules`除外）
  - [x] `env_file: .env.development` 指定
  - [x] 環境変数（NODE_ENV, VITE_ENV）設定
  - [x] `command: npm run dev -- --host 0.0.0.0`

- [x] docker-compose.prod.yml を作成する
  - [x] `app` サービス定義
  - [x] `target: production` 指定
  - [x] ポート 8080:80 マッピング
  - [x] `env_file: .env.production` 指定

## フェーズ2: 環境変数ファイルの作成

- [x] .env.example を作成する
  - [x] VITE_API_URL 変数定義
  - [x] VITE_ENV 変数定義

- [x] .env.development を作成する
  - [x] VITE_API_URL=http://localhost:5173
  - [x] VITE_ENV=development

- [x] .env.production を作成する
  - [x] VITE_API_URL=https://railway-game.example.com
  - [x] VITE_ENV=production

- [x] .gitignore を更新する
  - [x] `.env.development` を追加
  - [x] `.env.production` を追加

## フェーズ3: 品質チェックと修正

- [x] すべてのテストが通ることを確認
  - [x] `npm test`（14 tests passed）
- [x] リントエラーがないことを確認
  - [x] `npm run lint`（warningのみ、エラーなし）
- [x] 型エラーがないことを確認
  - [x] `npm run typecheck`（エラーなし）
- [x] ビルドが成功することを確認
  - [x] `npm run build`（成功）

## フェーズ4: ドキュメント更新

- [x] 実装後の振り返り（このファイルの下部に記録）

---

## 実装後の振り返り

### 実装完了日
2026-05-06

### 計画と実績の差分

**計画と異なった点**:
- `development`ステージから`USER nodejs`と`chown`を削除した（技術的理由: ボリュームマウント時にホストのファイルオーナーシップとコンテナのnodejsユーザー(uid=1001)が一致せず、VitestがVite設定の一時ファイルを生成できずEACCESエラーが発生した。開発ステージではrootで実行する方が実用的）
- `docker-compose.prod.yml` に `environment: NODE_ENV=production` を追加（アーキテクチャ仕様書には記載がなかったが、実際の動作に必要なため追加）

**新たに必要になったタスク**:
- 特になし

### 学んだこと

**技術的な学び**:
- Dockerのマルチステージビルドでは、`deps`ステージを分離することでnpmキャッシュを効率的に活用できる
- nginx:alpineのSPAルーティング設定は`try_files $uri $uri/ /index.html`で対応
- Vite dev serverをコンテナ外からアクセスさせるには`--host 0.0.0.0`が必要

**プロセス上の改善点**:
- ステアリングファイルによる計画→実装の流れがスムーズだった
- tasklist.mdをリアルタイムに更新することで進捗が明確になった

### 次回への改善提案
- Dockerビルドの実際の動作検証（docker compose up）も品質チェックに含めるとよい
- `.env.development`の初期値は`.env.example`からコピーするワンライナーをREADMEに記載すると親切
