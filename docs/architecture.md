# 技術仕様書 (Architecture Design Document)

## テクノロジースタック

### 言語・ランタイム

| 技術 | バージョン |
|------|-----------|
| Node.js | v24.11.0 |
| TypeScript | 5.x |
| npm | 11.x |

### フレームワーク・ライブラリ

| 技術 | バージョン | 用途 | 選定理由 |
|------|-----------|------|----------|
| React | 19.x | UIフレームワーク | コンポーネント設計、豊富なエコシステム、メンテナンス性 |
| Vite | 8.x | ビルドツール | 高速なHMR、最新のビルド設定、開発効率 |
| Zustand | 5.x | 状態管理 | シンプルで軽量、学習コストが低い、Redux比で10倍以上軽量 |
| Tailwind CSS | 4.x | CSSフレームワーク | レスポンシブデザイン、開発速度、一貫性のあるデザイン。@tailwindcss/viteプラグインで設定 |
| Vitest | 2.x | テストフレームワーク | Viteとの統合、高速、TypeScript対応 |
| React Testing Library | 16.x | コンポーネントテスト | ユーザー視点のテスト、ベストプラクティス |

### 開発ツール

| 技術 | バージョン | 用途 | 選定理由 |
|------|-----------|------|----------|
| ESLint | 9.x | 静的解析 | コード品質の維持、バグの早期発見 |
| Prettier | 3.x | コードフォーマッター | コードスタイルの統一、レビュー効率化 |
| TypeScript ESLint | 8.x | TypeScript用Lint | 型安全性の向上、ベストプラクティスの強制 |

## アーキテクチャパターン

### レイヤードアーキテクチャ

```
┌─────────────────────────┐
│   UIレイヤー             │ ← 画面表示とユーザー入力
├─────────────────────────┤
│   ゲームロジックレイヤー   │ ← クエスト・クイズ・パズルの管理
├─────────────────────────┤
│   データレイヤー          │ ← 路線データ・プレイヤーデータの管理
└─────────────────────────┘
```

#### UIレイヤー
- **責務**: 画面表示、ユーザー入力の受付、結果のフィードバック
- **許可される操作**: ゲームロジックレイヤーの呼び出し
- **禁止される操作**: データレイヤーへの直接アクセス
- **主要コンポーネント**:
  - Screen: 画面遷移管理
  - QuizUI: クイズ画面の表示
  - PuzzleUI: パズル画面の表示
  - CollectionUI: コレクション画面の表示

#### ゲームロジックレイヤー
- **責務**: ゲームのビジネスロジック、スコア計算、進捗管理
- **許可される操作**: データレイヤーの呼び出し
- **禁止される操作**: UIレイヤーへの直接依存
- **主要コンポーネント**:
  - QuestManager: クエスト管理
  - QuizEngine: クイズ採点ロジック
  - PuzzleEngine: パズル検証ロジック
  - ProgressManager: プレイヤー進捗管理
  - BadgeSystem: 実績システム

#### データレイヤー
- **責務**: データの永続化、取得、キャッシュ管理
- **許可される操作**: localStorage、静的データファイルへのアクセス
- **禁止される操作**: ビジネスロジックの実装
- **主要コンポーネント**:
  - RailwayDataRepository: 路線データの提供
  - QuizDataRepository: クイズデータの提供 (RailwayDataRepositoryから路線情報を参照)
  - PuzzleDataRepository: パズルデータの提供 (RailwayDataRepositoryから路線情報を参照)
  - PlayerDataRepository: プレイヤーデータの永続化

**リポジトリ間の依存関係**:
```
QuizDataRepository → RailwayDataRepository
PuzzleDataRepository → RailwayDataRepository
PlayerDataRepository (独立)
```

### コンポーネント構成図

```
src/
├── components/           # UIレイヤー
│   ├── screens/         # 画面コンポーネント
│   ├── quiz/            # クイズUI
│   ├── puzzle/          # パズルUI
│   └── collection/      # コレクションUI
├── services/            # ゲームロジックレイヤー
│   ├── QuestManager.ts
│   ├── QuizEngine.ts
│   ├── PuzzleEngine.ts
│   ├── ProgressManager.ts
│   └── BadgeSystem.ts
├── repositories/        # データレイヤー
│   ├── RailwayDataRepository.ts
│   ├── QuizDataRepository.ts
│   ├── PuzzleDataRepository.ts
│   └── PlayerDataRepository.ts
├── stores/              # 状態管理 (Zustand)
│   ├── questStore.ts
│   ├── progressStore.ts
│   └── uiStore.ts
└── types/               # 型定義
    └── index.ts
public/                  # 公開ディレクトリ
└── data/                # 静的データ (JSON)
    ├── railways/        # 路線データ
    ├── quizzes/         # クイズデータ
    └── puzzles/         # パズルデータ
```

## データ永続化戦略

### ストレージ方式

| データ種別 | ストレージ | フォーマット | 理由 |
|-----------|----------|-------------|------|
| プレイヤー進捗 | localStorage | JSON | ブラウザネイティブ、ユーザー登録不要、オフライン対応 |
| 路線データ | 静的ファイル (公開ディレクトリ) | JSON | 変更頻度が低い、全プレイヤー共通、ビルド時に最適化可能 |
| クイズデータ | 静的ファイル (公開ディレクトリ) | JSON | 変更頻度が低い、全プレイヤー共通、遅延読み込み可能 |
| パズルデータ | 静的ファイル (公開ディレクトリ) | JSON | 変更頻度が低い、全プレイヤー共通、必要な時だけロード |
| ゲーム設定 | localStorage | JSON | ユーザー固有の設定 (音量、表示設定など) |
| 路線写真メタデータ | 路線データJSON内に含む | JSON | 路線データと一体管理、撮影者・ライセンス情報を保持 |
| 路線写真画像 | 外部URL参照 (Wikimedia Commons) | - | **URL参照方式を採用**: Wikimedia CommonsのURLをそのまま参照。ストレージ不要。CSPで `https://upload.wikimedia.org` の許可が必要 |

### バックアップ戦略

**プレイヤーデータのバックアップ**:
- **頻度**: クエストクリア時、レベルアップ時に自動保存
- **保存先**: localStorage (キー: `railway_game_progress`, `railway_game_progress_backup`)
- **世代管理**: 最新版とバックアップ1世代を保持
- **復元方法**: アプリケーション起動時にバックアップの整合性チェック、破損時は自動復元

**実装例**:
```typescript
class PlayerDataRepository {
  private readonly STORAGE_KEY = 'railway_game_progress';
  private readonly BACKUP_KEY = 'railway_game_progress_backup';

  save(progress: PlayerProgress): void {
    try {
      // 現在のデータをバックアップ
      const current = localStorage.getItem(this.STORAGE_KEY);
      if (current) {
        localStorage.setItem(this.BACKUP_KEY, current);
      }
      
      // 新しいデータを保存
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      throw new StorageError('データの保存に失敗しました');
    }
  }

  load(): PlayerProgress | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      
      // メインデータがない場合、バックアップを試みる
      const backup = localStorage.getItem(this.BACKUP_KEY);
      if (backup) {
        console.warn('バックアップからデータを復元しました');
        return JSON.parse(backup);
      }
      
      return null;
    } catch (error) {
      console.error('データの読み込みに失敗しました', error);
      return null;
    }
  }
}
```

### データファイル構成

```
public/data/
├── railways/
│   ├── jr/
│   │   ├── yamanote.json      # 山手線
│   │   ├── chuo.json           # 中央線
│   │   └── sobu.json           # 総武線
│   ├── private/
│   │   ├── tokyu.json          # 東急線
│   │   ├── odakyu.json         # 小田急線
│   │   └── keio.json           # 京王線
│   └── metro/
│       ├── ginza.json          # 銀座線
│       └── marunouchi.json     # 丸ノ内線
├── quizzes/
│   ├── level1/                 # レベル1用クイズ
│   ├── level2/
│   ├── level3/
│   └── level4/
└── puzzles/
    ├── level1/                 # レベル1用パズル
    ├── level2/
    ├── level3/
    └── level4/
```

## パフォーマンス要件

### レスポンスタイム

| 操作 | 目標時間 | 測定環境 |
|------|---------|---------|
| 初回ページ読み込み | 3秒以内 | 平均的なブロードバンド環境 (10Mbps) |
| 2回目以降のページ読み込み | 1秒以内 | キャッシュ利用 |
| クイズ回答後のフィードバック表示 | 500ms以内 | ローカル処理 |
| パズル経路選択のレスポンス | 100ms以内 | ローカル処理 |
| 路線データの読み込み | 500ms以内/路線 | 遅延読み込み |
| プレイヤーデータの保存 | 100ms以内 | localStorage書き込み |

### リソース使用量

| リソース | 上限 | 理由 |
|---------|------|------|
| メモリ | 200MB | ブラウザゲームとして妥当な範囲 |
| 初回ダウンロードサイズ | 2MB | モバイル環境での通信量を考慮 |
| 路線データサイズ | 100KB/路線 | 遅延読み込み前提、必要最小限のデータ |
| localStorage使用量 | 5MB以内 | ブラウザの制限 (通常10MB) の半分以下に抑える |

### パフォーマンス最適化戦略

1. **遅延読み込み (Lazy Loading)**
   - 路線データ: 必要な路線のみロード
   - 画像: 画面に表示される直前にロード
   - コンポーネント: React.lazyでコード分割

2. **キャッシュ戦略**
   - 路線データ: メモリキャッシュ (アプリケーション起動中保持)
   - クイズ/パズルデータ: 使用後は破棄 (メモリ節約)

3. **画像最適化**
   - WebP形式を優先、フォールバックでPNG
   - レスポンシブ画像 (srcset使用)
   - アイコンはSVG

4. **バンドルサイズ最適化**
   - Tree shakingによる未使用コードの削除
   - Dynamic importによるコード分割
   - 依存ライブラリの最小化

## セキュリティアーキテクチャ

### データ保護

- **暗号化**: 個人情報を収集しないため、暗号化不要
- **アクセス制御**: localStorage は同一オリジンのみアクセス可能 (ブラウザのSame-Origin Policy)
- **機密情報管理**: APIキーなどの機密情報は使用しない

### 入力検証

- **バリデーション**: 
  - クイズ回答: 選択肢のインデックス (0-3) の範囲チェック
  - パズル経路: 駅IDの妥当性チェック
- **サニタイゼーション**: ユーザー入力は使用しないため不要
- **エラーハンドリング**: 
  - 不正な入力は無視
  - エラーメッセージには内部情報を含めない

### XSS対策

- **React標準のエスケープ**: Reactの`dangerouslySetInnerHTML`は使用しない
- **静的データの検証**: クイズ・パズルデータは開発時に検証済み
- **外部入力の排除**: ユーザーからのテキスト入力は受け付けない

### HTTPS

- **本番環境**: 必ずHTTPSで配信
- **CSP (Content Security Policy)**: script-src, style-src, img-srcを制限
  - img-src: 画像をWikimedia CommonsのURLから直接参照する場合は `https://upload.wikimedia.org` を許可する必要がある。自前ストレージに保存する場合は不要。

## スケーラビリティ設計

### データ増加への対応

**想定データ量**:
- 路線データ: 50路線程度 (首都圏の主要路線)
- クイズ: 1000問程度 (各レベル250問)
- パズル: 500問程度 (各レベル125問)
- プレイヤー進捗: 10,000件のイベント履歴

**対策**:
- **遅延読み込み**: 必要な路線・クイズ・パズルのみロード
- **データ圧縮**: JSON形式で最小限のデータ構造
- **進捗データの圧縮**: 完了したクエストIDのみ保存 (詳細履歴は保存しない)

### 機能拡張性

**新規路線の追加**:
- `public/data/railways/`に新しいJSONファイルを配置
- クエストデータに新路線を参照
- コード変更不要

**新規クイズ/パズルの追加**:
- `public/data/quizzes/`または`public/data/puzzles/`にJSONファイルを追加
- 既存のエンジンがそのまま動作

**新機能の追加**:
- レイヤードアーキテクチャにより、各レイヤーに新機能を追加可能
- Reactのコンポーネント設計により、UI拡張が容易

## 開発環境構成

### Docker Compose構成

開発環境は全てDockerコンテナで実行し、`docker compose up`で起動できるようにする。

**docker-compose.yml** (開発環境):
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    env_file:
      - .env.development
    environment:
      - NODE_ENV=development
      - VITE_ENV=development
    command: npm run dev -- --host 0.0.0.0
    stdin_open: true
    tty: true
```

**docker-compose.prod.yml** (本番環境相当の検証):
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - "8080:80"
    env_file:
      - .env.production
    environment:
      - NODE_ENV=production
```

**Dockerfile** (マルチステージビルド):
```dockerfile
# ベースステージ
FROM node:24.11.0-alpine AS base

# セキュリティ: 非rootユーザーで実行
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# 依存関係ステージ
FROM base AS deps

# 依存関係のキャッシュ最適化
COPY package*.json ./
RUN npm ci

# 開発環境ステージ
FROM base AS development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ユーザーを切り替え
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ビルドステージ
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# 本番環境ステージ
FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

# Nginxの設定 (SPAのルーティング対応)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 環境変数の管理

**ファイル構成**:
```
.env.development    # 開発環境用 (git管理外)
.env.production     # 本番環境用 (git管理外)
.env.example        # テンプレート (git管理)
```

**優先順位**: docker-compose.ymlの`environment` > `env_file` > Dockerfile ENV

**初期セットアップ**:
```bash
# テンプレートから環境変数ファイルを作成
cp .env.example .env.development
cp .env.example .env.production

# .env.developmentと.env.productionを編集
```

### 開発サーバー起動

**開発環境**:
```bash
# 開発環境の起動
docker compose up

# バックグラウンドで起動
docker compose up -d

# 停止
docker compose down
```

起動後、`http://localhost:5173`でアプリケーションにアクセス可能。

**本番環境相当の検証**:
```bash
# 本番ビルドの検証
docker compose -f docker-compose.prod.yml up --build

# ブラウザで確認
# http://localhost:8080
```

### コンテナ内でのコマンド実行

```bash
# コンテナ内でシェルを起動
docker compose exec app sh

# 依存関係のインストール
docker compose exec app npm install

# ビルド
docker compose exec app npm run build
```

### 開発・本番環境の使い分け

| 用途 | コマンド | 環境 | ポート |
|------|---------|------|--------|
| 日常的な開発 | `docker compose up` | 開発 | 5173 |
| 本番動作確認 | `docker compose -f docker-compose.prod.yml up --build` | 本番相当 | 8080 |
| テスト実行 | `docker compose run --rm app npm test` | 開発 | - |

## テスト戦略

### ユニットテスト
- **フレームワーク**: Vitest
- **対象**: 
  - QuizEngine: 採点ロジック
  - PuzzleEngine: 経路検証ロジック
  - ProgressManager: 進捗保存/読み込み
  - BadgeSystem: バッジ獲得条件の判定
- **カバレッジ目標**: 80%以上

### 統合テスト
- **方法**: Vitestで複数コンポーネントを組み合わせたテスト
- **対象**: 
  - クエストプレイフロー全体
  - デイリーチャレンジのリセット
  - レベルアップ処理

### コンポーネントテスト
- **ツール**: React Testing Library
- **対象**: 
  - QuizUI: クイズ画面の表示とインタラクション
  - PuzzleUI: パズル画面の表示とインタラクション
  - CollectionUI: コレクション画面の表示

### E2Eテスト
- **ツール**: Playwright (将来的に導入)
- **シナリオ**: 
  - クエストを開始してクリアまでの流れ
  - デイリーチャレンジのプレイ
  - コレクション画面での表示確認

### テスト実行

**ローカル環境**:
```bash
# ユニットテスト
npm run test

# カバレッジ付き
npm run test:coverage

# ウォッチモード
npm run test:watch
```

**Docker環境**:
```bash
# ユニットテスト
docker compose run --rm app npm run test

# カバレッジ付き (htmlレポートをホストで表示可能)
docker compose run --rm app npm run test:coverage
# → coverage/index.htmlをブラウザで開く

# CI環境での実行
docker compose run --rm app npm run test -- --reporter=junit --outputFile=test-results.xml

# ウォッチモード
docker compose run --rm app npm run test:watch
```

### カバレッジ測定と強制

**Vitest設定** (vitest.config.ts):
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.ts',
        '**/*.spec.ts',
        'src/types/',  // 型定義は除外
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

**CI/CDでの統合**:
```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run tests with coverage
        run: docker compose run --rm app npm run test:coverage
      
      - name: Check coverage threshold
        run: |
          if [ $(jq '.total.lines.pct' coverage/coverage-summary.json | cut -d. -f1) -lt 80 ]; then
            echo "カバレッジが80%未満です"
            exit 1
          fi
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true
```

**カバレッジ不足時の対応**:
1. テストを追加してカバレッジを向上させる
2. 正当な理由がある場合、該当ファイルをexcludeに追加 (PRレビューで承認必要)

### ローカルとDocker環境の使い分け

| 環境 | 使用ケース | メリット |
|------|----------|---------|
| ローカル | 高速なフィードバックが必要な開発 | 起動が速い、HMRが高速 |
| Docker | チーム全体での一貫性、CI/CD | 環境の統一、再現性が高い |

## 技術的制約

### 環境要件
- **ブラウザ**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript**: ES2020以降のサポート
- **localStorage**: 10MB以上の利用可能容量
- **画面解像度**: 最小 360x640px (モバイル)、推奨 1920x1080px (デスクトップ)

### パフォーマンス制約
- 初回ページ読み込みは3秒以内 (ブロードバンド環境)
- メモリ使用量は200MB以内
- localStorage使用量は5MB以内

### セキュリティ制約
- HTTPS必須 (本番環境)
- CSP (Content Security Policy) 適用
- ユーザー入力を受け付けない設計

## 依存関係管理

| ライブラリ | 用途 | バージョン管理方針 |
|-----------|------|-------------------|
| react | UIフレームワーク | ^19.0.0 (マイナーバージョンアップ許可) |
| react-dom | React DOM操作 | ^19.0.0 (Reactと同期) |
| zustand | 状態管理 | ^5.0.0 (マイナーバージョンアップ許可) |
| tailwindcss | CSSフレームワーク | ^4.0.0 (マイナーバージョンアップ許可) |
| vite | ビルドツール | ^8.0.0 (マイナーバージョンアップ許可) |
| typescript | 型システム | ~5.7.0 (パッチバージョンのみ) |
| vitest | テストフレームワーク | ^2.0.0 (マイナーバージョンアップ許可) |

**方針**:
- 安定版は `^` でマイナーバージョンまで許可
- TypeScriptは `~` でパッチバージョンのみ許可 (破壊的変更を避ける)
- 定期的な依存関係の更新 (月1回)
- セキュリティアップデートは即座に適用

## デプロイメント戦略

### ビルドプロセス

**ローカル環境**:
```bash
# 開発環境
npm run dev        # Vite dev server起動

# 本番ビルド
npm run build      # TypeScriptコンパイル + Viteビルド
npm run preview    # ビルド結果のプレビュー
```

**Docker環境**:
```bash
# 開発環境
docker compose up  # Vite dev server起動

# 本番ビルド
docker compose run --rm app npm run build

# ビルド結果のプレビュー
docker compose run --rm app npm run preview
```

### ホスティング

**推奨プラットフォーム**:
- Vercel (推奨): 自動デプロイ、CDN、HTTPS標準
- Netlify: 同様の機能を提供
- GitHub Pages: 静的サイトホスティング

**デプロイフロー**:
1. `main`ブランチへのpush
2. 自動ビルド実行
3. 本番環境へデプロイ
4. キャッシュの無効化

### 環境変数

開発環境と本番環境で切り替える設定:

**ファイル構成**:
```bash
# .env.example (テンプレート - git管理)
VITE_API_URL=http://localhost:5173
VITE_ENV=development

# .env.development (git管理外)
VITE_API_URL=http://localhost:5173
VITE_ENV=development

# .env.production (git管理外)
VITE_API_URL=https://railway-game.example.com
VITE_ENV=production
```

**.gitignore設定**:
```
.env.development
.env.production
.env.local
```

### デプロイ前のチェックリスト

本番環境へのデプロイ前に以下を確認:

- [ ] `docker-compose.prod.yml`でビルドが成功する
- [ ] 本番環境変数(`.env.production`)が正しく設定されている
- [ ] パフォーマンス要件を満たしている (Lighthouse CI)
- [ ] 全テストがパスし、カバレッジが80%以上
- [ ] セキュリティスキャンが完了 (npm audit)
- [ ] CSP設定が適切に構成されている

## モニタリングとロギング

### ロギング戦略

**開発環境**:
```typescript
// utils/logger.ts
export const logger = {
  info: (message: string, meta?: object) => {
    if (import.meta.env.DEV) {
      console.log(`[INFO] ${message}`, meta);
    }
  },
  warn: (message: string, meta?: object) => {
    if (import.meta.env.DEV) {
      console.warn(`[WARN] ${message}`, meta);
    }
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
    // 将来的にSentryへ送信
    if (import.meta.env.PROD) {
      // TODO: Sentry.captureException(error);
    }
  },
};
```

**本番環境での準備**:
- エラーログは構造化して収集可能にする
- パフォーマンス指標 (Web Vitals) は測定可能にする
- 将来のSentry導入時に最小限の変更で移行できる設計

**導入タイミング**:
- MVP: console.logベース
- Post-MVP: Sentry導入 (ユーザー数500人超の時点)

### エラートラッキング

**将来的な導入候補**:
- Sentry: エラーの自動収集と通知
- Google Analytics: ユーザー行動の分析

**現時点では**:
- ブラウザのコンソールログ
- localStorage の書き込み失敗をトラック

### パフォーマンスモニタリング

**Lighthouse CI による自動測定**:
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build application
        run: |
          docker compose run --rm app npm ci
          docker compose run --rm app npm run build
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:5173
          budgetPath: ./lighthouse-budget.json
```

**パフォーマンス予算** (lighthouse-budget.json):
```json
{
  "budgets": [
    {
      "path": "/*",
      "timings": [
        { "metric": "first-contentful-paint", "budget": 3000 },
        { "metric": "interactive", "budget": 3000 }
      ],
      "resourceSizes": [
        { "resourceType": "total", "budget": 2000 }
      ]
    }
  ]
}
```

**検証タイミング**:
- PR作成時: 自動実行
- デプロイ前: 本番環境で手動確認
- 定期実行: 毎週月曜日に自動測定

## 技術的負債の管理

### 既知の制約と将来の改善

| 項目 | 現状の制約 | 将来の改善 | 優先度 | 対応時期 | トリガー条件 |
|------|-----------|----------|--------|---------|-------------|
| ローカルストレージ容量 | 5MB制限 | IndexedDB移行 | P2 | Post-MVP | ユーザーデータが4MB超過時 |
| オフライン対応 | なし | Service Worker導入 | P2 | Post-MVP | DAU 500人到達時 |
| マルチプレイヤー | スコープ外 | バックエンドAPI + WebSocket | P3 | 将来検討 | ユーザー要望が多い場合 |
| ランキングシステム | ローカルのみ | バックエンドAPI | P2 | Post-MVP | DAU 500人到達時 |
| エラートラッキング | console.log | Sentry導入 | P2 | Post-MVP | ユーザー数500人超 |
| パフォーマンス監視 | 手動測定 | 自動モニタリング | P2 | Post-MVP | 本番リリース後 |

**優先度の定義**:
- P0: 必須、MVP前に対応
- P1: 重要、MVP後すぐに対応
- P2: できれば対応、Post-MVP
- P3: 将来検討

**対応プロセス**:
1. トリガー条件に到達
2. Issue作成 + 影響範囲調査
3. 設計書更新
4. 実装・テスト
5. デプロイ

### 定期メンテナンス

**月次タスク**:
- 依存関係の更新 (`npm outdated`で確認)
- セキュリティ脆弱性のチェック (`npm audit`)
- パフォーマンス指標の確認 (Lighthouse CI)

**四半期タスク**:
- 技術的負債の見直し
- アーキテクチャドキュメントの更新
- テストカバレッジの改善
