# 首都圏鉄道マスター

楽しく学べる鉄道知識ブラウザゲーム。クイズとパズルの融合で、首都圏の鉄道知識を段階的に習得できる。

## プロジェクト概要

- **クイズとパズルの融合**: 鉄道に関する知識をクイズで学び、パズルで実践する二段階学習
- **段階的な路線アンロック**: 簡単な山手線から始まり、複雑な相互直通運転まで段階的に難易度が上がる
- **実在する豊富な路線網**: 首都圏のJR線と私鉄線（東急・小田急・京王・西武・東武・京急・京成・東京メトロなど）を網羅

## 技術スタック

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Node.js | v24.11.0 | ランタイム |
| TypeScript | 5.x | 言語 |
| React | 19.x | UIフレームワーク |
| Vite | 8.x | ビルドツール |
| Zustand | 5.x | 状態管理 |
| Tailwind CSS | 4.x | CSSフレームワーク |
| Vitest | 2.x | テストフレームワーク |

## 開発環境のセットアップ

### 前提条件

- Docker
- Visual Studio Code + Dev Containers 拡張機能

### 手順

```bash
# 1. リポジトリのクローン
git clone <this-repository>
cd metropolitan-train-challenge-game

# 2. VS Code で開き、Dev Container を起動
# 「Reopen in Container」を選択
```

Dev Container 起動時に以下が自動実行されます:

- Node.js v24.11.0 環境の構築
- `npm install` の実行
- Claude Code の最新版インストール

## npm スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバーの起動（http://localhost:5173） |
| `npm run build` | プロダクションビルド |
| `npm test` | テストの実行 |
| `npm run test:watch` | テストのウォッチモード |
| `npm run test:coverage` | カバレッジレポートの生成 |
| `npm run test:ui` | Vitest UI でのテスト実行 |
| `npm run lint` | ESLint による静的解析 |
| `npm run typecheck` | TypeScript の型チェック |
| `npm run format` | Prettier によるコードフォーマット |

## ディレクトリ構造

```
.
├── src/
│   ├── components/     # UIレイヤー (Reactコンポーネント)
│   ├── services/       # ゲームロジックレイヤー
│   ├── repositories/   # データレイヤー
│   ├── stores/         # 状態管理 (Zustand)
│   ├── types/          # 型定義
│   ├── App.tsx
│   └── main.tsx
├── public/             # 静的ファイル (ゲームデータ・画像)
├── tests/              # テストコード
├── docs/               # プロジェクトドキュメント
└── .steering/          # 作業履歴 (ステアリングファイル)
```

## ドキュメント

| ドキュメント | 説明 |
|-------------|------|
| [product-requirements.md](docs/product-requirements.md) | プロダクト要求定義書 |
| [functional-design.md](docs/functional-design.md) | 機能設計書 |
| [architecture.md](docs/architecture.md) | 技術仕様書 |
| [repository-structure.md](docs/repository-structure.md) | リポジトリ構造定義書 |
| [development-guidelines.md](docs/development-guidelines.md) | 開発ガイドライン |
| [glossary.md](docs/glossary.md) | 用語集 |
