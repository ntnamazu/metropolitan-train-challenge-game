# リポジトリ構造定義書 (Repository Structure Document)

## プロジェクト構造

```
railway-game/
├── src/                          # ソースコード
│   ├── components/               # UIレイヤー (Reactコンポーネント)
│   ├── services/                 # ゲームロジックレイヤー
│   ├── repositories/             # データレイヤー
│   ├── stores/                   # 状態管理 (Zustand)
│   ├── types/                    # 型定義
│   ├── hooks/                    # カスタムReact Hooks
│   ├── utils/                    # ユーティリティ関数
│   ├── App.tsx                   # Appコンポーネント
│   ├── main.tsx                  # エントリーポイント
│   └── index.css                 # グローバルスタイル
├── public/                       # 公開ディレクトリ (静的ファイル)
│   ├── data/                     # ゲームデータ (JSON)
│   ├── images/                   # 画像ファイル
│   └── index.html                # HTMLテンプレート
├── tests/                        # テストコード
│   ├── unit/                     # ユニットテスト
│   ├── integration/              # 統合テスト
│   └── setup.ts                  # テストセットアップ
├── docs/                         # プロジェクトドキュメント
│   ├── product-requirements.md   # PRD
│   ├── functional-design.md      # 機能設計書
│   ├── architecture.md           # アーキテクチャ設計書
│   ├── repository-structure.md   # 本ドキュメント
│   ├── development-guidelines.md # 開発ガイドライン
│   └── glossary.md               # 用語集
├── .claude/                      # Claude Code設定
│   ├── commands/                 # スラッシュコマンド
│   └── skills/                   # タスクモード別スキル
├── .steering/                    # ステアリングファイル (作業履歴として保持)
├── .devcontainer/                # Dev Container設定
├── package.json                  # npm設定
├── tsconfig.json                 # TypeScript設定
├── vite.config.ts                # Vite設定
├── tailwind.config.js            # Tailwind CSS設定
├── vitest.config.ts              # Vitest設定
├── eslint.config.js              # ESLint設定
├── .prettierrc                   # Prettier設定
├── .gitignore                    # Git除外設定
├── README.md                     # プロジェクト概要
└── CLAUDE.md                     # Claude Code用プロジェクトメモリ
```

## ディレクトリ詳細

### src/ (ソースコードディレクトリ)

#### components/ (UIレイヤー)

**役割**: Reactコンポーネントの配置。画面表示とユーザーインタラクションを担当。

**構造**:
```
components/
├── screens/                # 画面コンポーネント
│   ├── HomeScreen.tsx
│   ├── QuestListScreen.tsx
│   ├── QuestPlayScreen.tsx
│   ├── CollectionScreen.tsx
│   └── DailyChallengeScreen.tsx
├── quiz/                   # クイズUI
│   ├── QuizContainer.tsx
│   ├── QuizQuestion.tsx
│   ├── QuizChoices.tsx
│   └── QuizResult.tsx
├── puzzle/                 # パズルUI
│   ├── PuzzleContainer.tsx
│   ├── RailwayMap.tsx
│   ├── StationNode.tsx
│   ├── PathDisplay.tsx
│   └── ConstraintPanel.tsx
├── collection/             # コレクションUI
│   ├── CollectionContainer.tsx
│   ├── BadgeCard.tsx
│   ├── VehicleCard.tsx
│   └── LineCard.tsx
├── common/                 # 共通コンポーネント
│   ├── Button.tsx
│   ├── Modal.tsx
│   ├── ProgressBar.tsx
│   ├── Timer.tsx
│   └── LoadingSpinner.tsx
└── layout/                 # レイアウトコンポーネント
    ├── Header.tsx
    ├── Footer.tsx
    └── NavigationBar.tsx
```

**配置ファイル**:
- **screens/**: 画面全体を表すコンポーネント
- **quiz/, puzzle/, collection/**: 機能別のUIコンポーネント
- **common/**: 複数の画面で使い回されるUIコンポーネント
- **layout/**: ヘッダー、フッターなどのレイアウトコンポーネント

**命名規則**:
- コンポーネントファイル: PascalCase + `.tsx`
- 例: `QuizContainer.tsx`, `StationNode.tsx`
- 1ファイル1コンポーネントが原則

**依存関係**:
- 依存可能: `services/`, `stores/`, `hooks/`, `types/`, `utils/`
- 依存禁止: `repositories/` (直接のデータアクセスは禁止)

#### services/ (ゲームロジックレイヤー)

**役割**: ゲームのビジネスロジックを実装。クエスト管理、クイズ採点、パズル検証など。

**構造**:
```
services/
├── QuestManager.ts         # クエスト管理
├── QuizEngine.ts           # クイズエンジン
├── PuzzleEngine.ts         # パズルエンジン
├── ProgressManager.ts      # 進捗管理
├── BadgeSystem.ts          # 実績システム
└── DailyChallengeManager.ts # デイリーチャレンジ管理
```

**配置ファイル**:
- ビジネスロジックを実装するクラス
- ゲームルール、スコア計算、進捗管理など

**主要サービスクラス** (詳細は[用語集](./glossary.md#技術用語)を参照):
- QuestManager: クエスト管理
- QuizEngine: クイズ採点ロジック
- PuzzleEngine: パズル検証ロジック
- ProgressManager: プレイヤー進捗管理
- BadgeSystem: 実績システム

**命名規則**:
- クラスファイル: PascalCase + 役割接尾辞 (Manager, Engine, System)
- 例: `QuestManager.ts`, `QuizEngine.ts`

**依存関係**:
- 依存可能: `repositories/`, `types/`, `utils/`
- 依存禁止: `components/`, `stores/` (UIレイヤーへの依存は禁止)

#### repositories/ (データレイヤー)

**役割**: データの永続化と取得を担当。localStorage、静的JSONファイルからのデータ読み込み。

**構造**:
```
repositories/
├── RailwayDataRepository.ts    # 路線データリポジトリ
├── QuizDataRepository.ts       # クイズデータリポジトリ
├── PuzzleDataRepository.ts     # パズルデータリポジトリ
└── PlayerDataRepository.ts     # プレイヤーデータリポジトリ
```

**配置ファイル**:
- データアクセスを抽象化するリポジトリクラス
- localStorage操作、JSONファイル読み込み

**命名規則**:
- クラスファイル: PascalCase + `Repository.ts`
- 例: `RailwayDataRepository.ts`

**依存関係**:
- 依存可能: `types/`, `utils/`, 他のリポジトリクラス (下記参照)
- 依存禁止: `services/`, `components/` (ビジネスロジック、UIへの依存は禁止)

**リポジトリ間の依存関係** (詳細は[アーキテクチャ設計書](./architecture.md#データレイヤー)参照):
```
QuizDataRepository → RailwayDataRepository (路線情報を参照)
PuzzleDataRepository → RailwayDataRepository (路線情報を参照)
PlayerDataRepository (独立)
```
- QuizDataRepository、PuzzleDataRepositoryは、クイズやパズルの問題に関連する路線情報を取得するためにRailwayDataRepositoryに依存します
- PlayerDataRepositoryは他のリポジトリに依存せず独立して動作します

#### stores/ (状態管理)

**役割**: Zustandを使用したグローバル状態管理。

**構造**:
```
stores/
├── questStore.ts           # クエスト関連の状態
├── progressStore.ts        # プレイヤー進捗の状態
├── uiStore.ts              # UI状態 (モーダル表示など)
└── index.ts                # Store エクスポート
```

**配置ファイル**:
- Zustand storeの定義
- 状態とアクションの定義

**命名規則**:
- ファイル名: camelCase + `Store.ts`
- 例: `questStore.ts`, `progressStore.ts`

**依存関係**:
- 依存可能: `services/`, `types/`
- 依存禁止: `components/` (Storeがコンポーネントに依存しない)

#### types/ (型定義)

**役割**: TypeScriptの型定義。インターフェース、型エイリアス、Enumなど。

**構造**:
```
types/
├── index.ts                # 全型定義のエクスポート
├── quest.ts                # クエスト関連の型
├── quiz.ts                 # クイズ関連の型
├── puzzle.ts               # パズル関連の型
├── railway.ts              # 路線関連の型
├── player.ts               # プレイヤー関連の型
└── common.ts               # 共通型
```

**配置ファイル**:
- インターフェース、型エイリアス、Enum定義
- 機能別にファイルを分割

**命名規則**:
- ファイル名: kebab-case + `.ts`
- 例: `quest.ts`, `railway.ts`
- 型名: PascalCase
- 例: `Quest`, `QuizQuestion`, `RailwayLine`

**依存関係**:
- 依存可能: なし (純粋な型定義のみ)
- 依存禁止: すべてのレイヤー

#### hooks/ (カスタムReact Hooks)

**役割**: カスタムReact Hooksの配置。ロジックの再利用。

**構造**:
```
hooks/
├── useQuest.ts             # クエスト関連のHook
├── useQuiz.ts              # クイズ関連のHook
├── usePuzzle.ts            # パズル関連のHook
├── useProgress.ts          # 進捗関連のHook
└── useTimer.ts             # タイマーHook
```

**配置ファイル**:
- カスタムReact Hooks
- ロジックの抽出と再利用

**命名規則**:
- ファイル名: camelCase + `.ts`、`use`で始まる
- 例: `useQuest.ts`, `useTimer.ts`
- Hook名: `use` + PascalCase
- 例: `useQuest`, `useTimer`

**依存関係**:
- 依存可能: `services/`, `stores/`, `types/`, `utils/`
- 依存禁止: `components/` (Hooksがコンポーネントに依存しない)

#### utils/ (ユーティリティ関数)

**役割**: 汎用的なユーティリティ関数。複数のレイヤーで使用される共通処理。

**構造**:
```
utils/
├── date.ts                 # 日付操作
├── storage.ts              # localStorage操作
├── validation.ts           # バリデーション
└── format.ts               # フォーマット処理
```

**配置ファイル**:
- 純粋関数
- 副作用のないユーティリティ

**命名規則**:
- ファイル名: kebab-case + `.ts`
- 例: `date.ts`, `storage.ts`
- 関数名: camelCase
- 例: `formatDate`, `validateQuizAnswer`

**依存関係**:
- 依存可能: `types/`
- 依存禁止: `services/`, `repositories/`, `components/` (ユーティリティは独立)

### public/ (公開ディレクトリ)

#### data/ (ゲームデータ)

**役割**: 静的なゲームデータ (JSON形式)

**構造**:
```
public/data/
├── railways/               # 路線データ
│   ├── jr/
│   │   ├── yamanote.json
│   │   ├── chuo.json
│   │   ├── sobu.json
│   │   └── tobu-kamedo.json
│   ├── private/
│   │   ├── tokyu.json
│   │   ├── odakyu.json
│   │   ├── keio.json
│   │   ├── seibu.json
│   │   ├── tobu.json
│   │   ├── keisei.json
│   │   └── keikyu.json
│   └── metro/
│       ├── ginza.json
│       ├── marunouchi.json
│       └── fukutoshin.json
├── quizzes/                # クイズデータ
│   ├── level1/
│   │   ├── yamanote-quiz.json
│   │   └── chuo-quiz.json
│   ├── level2/
│   ├── level3/
│   └── level4/
├── puzzles/                # パズルデータ
│   ├── level1/
│   │   ├── yamanote-puzzle-01.json
│   │   └── chuo-puzzle-01.json
│   ├── level2/
│   ├── level3/
│   └── level4/
└── quests/                 # クエストデータ
    ├── level1/
    ├── level2/
    ├── level3/
    └── level4/
```

**命名規則**:
- JSONファイル: kebab-case + `.json`
- 例: `yamanote.json`, `yamanote-quiz.json`

#### images/ (画像ファイル)

**構造**:
```
public/images/
├── railways/               # 路線カラー、ロゴ
├── vehicles/               # 車両画像
├── badges/                 # バッジアイコン
├── ui/                     # UIアイコン
└── backgrounds/            # 背景画像
```

**命名規則**:
- 画像ファイル: kebab-case + 拡張子
- 例: `yamanote-line.svg`, `badge-master.png`

### tests/ (テストディレクトリ)

#### unit/ (ユニットテスト)

**役割**: 個別のクラス・関数のテスト

**構造**:
```
tests/unit/
└── src/                    # srcディレクトリと同じ構造
    ├── components/
    │   ├── quiz/
    │   │   ├── QuizContainer.test.tsx
    │   │   ├── QuizQuestion.test.tsx
    │   │   └── QuizChoices.test.tsx
    │   ├── puzzle/
    │   │   ├── PuzzleContainer.test.tsx
    │   │   └── RailwayMap.test.tsx
    │   └── common/
    │       ├── Button.test.tsx
    │       └── Modal.test.tsx
    ├── services/
    │   ├── QuestManager.test.ts
    │   ├── QuizEngine.test.ts
    │   ├── PuzzleEngine.test.ts
    │   └── BadgeSystem.test.ts
    ├── repositories/
    │   └── PlayerDataRepository.test.ts
    └── utils/
        ├── date.test.ts
        └── validation.test.ts
```

**命名規則**:
- パターン: `[テスト対象ファイル名].test.ts` (または `.test.tsx`)
- 例: `QuestManager.ts` → `QuestManager.test.ts`
- 例: `QuizContainer.tsx` → `QuizContainer.test.tsx`

#### integration/ (統合テスト)

**役割**: 複数のコンポーネントを組み合わせたテスト

**構造**:
```
tests/integration/
├── quest-flow.test.ts      # クエストプレイフロー
├── daily-challenge.test.ts # デイリーチャレンジ
└── level-up.test.ts        # レベルアップ処理
```

**命名規則**:
- パターン: `[シナリオ名].test.ts`
- 例: `quest-flow.test.ts`

### docs/ (ドキュメントディレクトリ)

**配置ドキュメント**:
- `product-requirements.md`: プロダクト要求定義書 (PRD)
- `functional-design.md`: 機能設計書
- `architecture.md`: アーキテクチャ設計書
- `repository-structure.md`: リポジトリ構造定義書 (本ドキュメント)
- `development-guidelines.md`: 開発ガイドライン
- `glossary.md`: 用語集

### .claude/ (Claude Code設定)

**役割**: Claude Code設定とカスタマイズ

**構造**:
```
.claude/
├── commands/               # スラッシュコマンド
└── skills/                 # タスクモード別スキル
    ├── prd-writing/
    ├── functional-design/
    ├── architecture-design/
    ├── repository-structure/
    ├── development-guidelines/
    ├── glossary-creation/
    ├── steering/
    ├── review-docs/
    ├── add-feature/
    └── setup-project/
```

### .devcontainer/ (Dev Container設定)

**役割**: VSCode Dev Containerの設定。チーム全体で統一された開発環境を提供。

**構造**:
```
.devcontainer/
├── devcontainer.json       # Dev Container設定
└── devcontainer-lock.json  # コンテナの依存関係ロック
```

**設定内容**:
- Node.js v24.11.0
- TypeScript 5.x
- VSCode拡張機能の自動インストール (ESLint, Prettier, TypeScript)
- ポートフォワーディング (5173: Vite dev server)

**メリット**:
- 環境構築の手間を削減
- チーム全体で統一された環境
- ホストOSに依存しない再現可能な環境

### .steering/ (ステアリングファイル)

**役割**: 特定の開発作業における「今回何をするか」を定義

**構造**:
```
.steering/
└── [YYYYMMDD]-[task-name]/
    ├── requirements.md      # 今回の作業の要求内容
    ├── design.md            # 変更内容の設計
    └── tasklist.md          # タスクリスト
```

**命名規則**: `20260105-add-puzzle-feature` 形式

**Git管理方針**: 
- **現在の方針**: Git管理する (リポジトリにコミット)
- **理由**: 作業の意図・設計判断・実装過程を記録し、プロジェクトの知識ベースとして蓄積するため
- **メリット**:
  - 過去の実装判断の理由を追跡できる
  - 類似機能を追加する際に、過去のアプローチを参照できる
  - チームメンバーが作業履歴から学べる
  - 「なぜこうしたのか」という暗黙知を明示化できる

**永続ドキュメント(`docs/`)との使い分け**:
- `.steering/`: 特定の作業の詳細な計画・実装過程・判断理由
- `docs/`: プロジェクト全体の設計・方針・ルール

**保管期限**: 原則として削除せず、履歴として保持。ディスク容量が問題になる場合のみ、古い作業ファイル(1年以上前)のアーカイブを検討

## ファイル配置規則

### ソースファイル

| ファイル種別 | 配置先 | 命名規則 | 例 |
|------------|--------|---------|-----|
| Reactコンポーネント | src/components/ | PascalCase.tsx | QuizContainer.tsx |
| サービスクラス | src/services/ | PascalCase.ts | QuestManager.ts |
| リポジトリクラス | src/repositories/ | PascalCase.ts | RailwayDataRepository.ts |
| カスタムHook | src/hooks/ | useCamelCase.ts | useQuest.ts |
| 型定義 | src/types/ | kebab-case.ts | quest.ts |
| ユーティリティ | src/utils/ | kebab-case.ts | date.ts |
| Zustand Store | src/stores/ | camelCaseStore.ts | questStore.ts |

### テストファイル

| テスト種別 | 配置先 | 命名規則 | 例 |
|-----------|--------|---------|-----|
| ユニットテスト | tests/unit/src/ | [対象].test.ts | QuestManager.test.ts |
| 統合テスト | tests/integration/ | [シナリオ].test.ts | quest-flow.test.ts |
| E2Eテスト (将来) | tests/e2e/ | [シナリオ].spec.ts | user-workflow.spec.ts |

### 設定ファイル

| ファイル種別 | 配置先 | 命名規則 |
|------------|--------|---------|
| TypeScript設定 | プロジェクトルート | tsconfig.json |
| Vite設定 | プロジェクトルート | vite.config.ts |
| Tailwind設定 | プロジェクトルート | tailwind.config.js |
| ESLint設定 | プロジェクトルート | eslint.config.js |
| Prettier設定 | プロジェクトルート | .prettierrc |
| Vitest設定 | プロジェクトルート | vitest.config.ts |

## 命名規則

### ディレクトリ名

- **レイヤーディレクトリ**: 複数形、kebab-case
  - 例: `components/`, `services/`, `repositories/`, `stores/`, `hooks/`
- **機能ディレクトリ**: 単数形、kebab-case
  - 例: `quiz/`, `puzzle/`, `collection/`

### ファイル名

- **Reactコンポーネント**: PascalCase + `.tsx`
  - 例: `QuizContainer.tsx`, `StationNode.tsx`
- **サービス・リポジトリクラス**: PascalCase + `.ts`
  - 例: `QuestManager.ts`, `RailwayDataRepository.ts`
- **カスタムHook**: `use` + PascalCase + `.ts`
  - 例: `useQuest.ts`, `useTimer.ts`
- **型定義**: kebab-case + `.ts`
  - 例: `quest.ts`, `railway.ts`
- **ユーティリティ関数**: kebab-case + `.ts`
  - 例: `date.ts`, `storage.ts`
- **Zustand Store**: camelCase + `Store.ts`
  - 例: `questStore.ts`, `progressStore.ts`

### テストファイル名

- パターン: `[テスト対象].test.ts` または `[テスト対象].spec.ts`
- 例: `QuestManager.test.ts`, `quest-flow.test.ts`

## 依存関係のルール

### レイヤー間の依存

```
UIレイヤー (components/)
    ↓ (OK)
ゲームロジックレイヤー (services/)
    ↓ (OK)
データレイヤー (repositories/)
```

**許可される依存**:
- `components/` → `services/`, `stores/`, `hooks/`, `types/`, `utils/`
- `services/` → `repositories/`, `types/`, `utils/`
- `repositories/` → `types/`, `utils/`, 他のリポジトリクラス (例: QuizDataRepository → RailwayDataRepository)
- `stores/` → `services/`, `types/`
- `hooks/` → `services/`, `stores/`, `types/`, `utils/`

**禁止される依存**:
- `repositories/` → `services/`, `components/` (❌)
- `services/` → `components/`, `stores/` (❌)
- `types/` → 任意のレイヤー (❌)
- `utils/` → `services/`, `repositories/`, `components/` (❌)

**リポジトリ間の依存に関する注意**:
- リポジトリ間の依存は許可されますが、循環依存は禁止です
- 許可される例: QuizDataRepository → RailwayDataRepository (一方向)
- 禁止される例: QuizDataRepository ⇄ PuzzleDataRepository (循環)

### モジュール間の依存

**循環依存の禁止**:
```typescript
// ❌ 悪い例: 循環依存
// services/QuestManager.ts
import { QuizEngine } from './QuizEngine';

// services/QuizEngine.ts
import { QuestManager } from './QuestManager';  // 循環依存！
```

**解決策: インターフェースの抽出**:
```typescript
// ✅ 良い例: 共通の型定義を使用
// types/services.ts
export interface IQuestManager { /* ... */ }
export interface IQuizEngine { /* ... */ }

// services/QuestManager.ts
import type { IQuizEngine } from '../types/services';

export class QuestManager {
  constructor(private quizEngine: IQuizEngine) {}
}

// services/QuizEngine.ts
import type { IQuestManager } from '../types/services';

export class QuizEngine {
  constructor(private questManager: IQuestManager) {}
}
```

## スケーリング戦略

### 機能の追加

新しい機能を追加する際の配置方針:

1. **小規模機能**: 既存ディレクトリに配置
   - 例: 新しいバッジを追加 → `services/BadgeSystem.ts` に追加

2. **中規模機能**: レイヤー内にサブディレクトリを作成
   - 例: 新しいパズルタイプを追加 → `components/puzzle/` に新コンポーネント追加

3. **大規模機能**: 独立したモジュールとして分離
   - 例: ランキングシステムを追加 → `services/RankingManager.ts`, `components/ranking/` を新規作成

### データファイルのスケーリング

プロジェクトの成長に伴い、路線50本、クイズ1000問、パズル500問規模への拡張を想定した戦略:

#### 路線データ (50路線想定)

**構造**:
```
public/data/railways/
├── jr/                     # JR路線
│   ├── yamanote.json
│   ├── chuo.json
│   ├── sobu.json
│   └── tobu-kamedo.json
├── private/                # 私鉄
│   ├── tokyu.json
│   ├── odakyu.json
│   ├── keio.json
│   ├── seibu.json
│   ├── tobu.json
│   ├── keisei.json
│   └── keikyu.json
└── metro/                  # 地下鉄
    ├── ginza.json
    ├── marunouchi.json
    └── fukutoshin.json
```

**配置方針**:
- 1路線1ファイルで管理
- カテゴリ別(jr/, private/, metro/)に分類
- ファイル名: `[路線ID].json` (kebab-case)

#### クイズデータ (1000問想定)

**構造**:
```
public/data/quizzes/
├── level1/
│   ├── yamanote-quiz.json      # 山手線のクイズ (20-50問)
│   ├── chuo-quiz.json          # 中央線のクイズ (20-50問)
│   └── ...
├── level2/
│   ├── yamanote-quiz.json
│   └── ...
├── level3/
└── level4/
```

**配置方針**:
- レベル別 × 路線別に分類
- 1路線あたり20-50問を1ファイルにまとめる
- ファイル名: `[路線ID]-quiz.json`
- 合計: 50路線 × 4レベル × 平均30問 = 約6,000問対応可能

#### パズルデータ (500問想定)

**構造**:
```
public/data/puzzles/
├── level1/
│   ├── yamanote-puzzle-01.json  # 山手線のパズル1
│   ├── yamanote-puzzle-02.json  # 山手線のパズル2
│   ├── chuo-puzzle-01.json
│   └── ...
├── level2/
├── level3/
└── level4/
```

**配置方針**:
- レベル別 × 路線別に分類
- 1ファイルあたり1-5問 (パズルデータは大きいため)
- ファイル名: `[路線ID]-puzzle-[連番2桁].json`
- 合計: 50路線 × 4レベル × 平均3問 = 約600問対応可能

#### インデックスファイル (データ検索最適化)

**構造**:
```
public/data/index/
├── railways.json           # 全路線の一覧
├── quizzes.json            # 全クイズの一覧
└── puzzles.json            # 全パズルの一覧
```

**メリット**:
- 全データを読み込まずに一覧を取得可能
- 初回ロード時間の短縮
- 検索機能の実装が容易

**railways.json の例**:
```json
{
  "railways": [
    {
      "id": "yamanote",
      "name": "山手線",
      "category": "jr",
      "file": "/data/railways/jr/yamanote.json"
    },
    {
      "id": "chuo",
      "name": "中央線",
      "category": "jr",
      "file": "/data/railways/jr/chuo.json"
    }
  ]
}
```

#### スケーリングのタイミング

- **Phase 1** (現在): 10路線、100問規模
- **Phase 2** (DAU 100達成時): 20路線、300問規模
- **Phase 3** (DAU 500達成時): 50路線、1000問規模 + インデックスファイル導入

### ファイルサイズの管理

**ファイル分割の目安**:
- 1ファイル: 300行以下を推奨
- 300-500行: リファクタリングを検討
- 500行以上: 分割を強く推奨

**分割方法**:
```typescript
// 悪い例: 1ファイルに全機能
// QuestManager.ts (800行)

// 良い例: 責務ごとに分割
// QuestManager.ts (200行) - クエスト管理のコア
// QuestValidator.ts (150行) - クエストのバリデーション
// QuestRewardCalculator.ts (100行) - 報酬計算
```

## 除外設定

### .gitignore

プロジェクトで除外すべきファイル:
```
# 依存関係
node_modules/

# ビルド成果物
dist/
build/

# 環境変数
.env
.env.local

# ログファイル
*.log

# OS固有ファイル
.DS_Store
Thumbs.db

# IDE設定
.vscode/
.idea/

# テストカバレッジ
coverage/
```

**注意**: `.steering/` はGit管理します(知識ベースとして履歴を保持するため)

### .prettierignore, .eslintignore

ツールで除外すべきファイル:
```
# ビルド成果物
dist/
build/

# 依存関係
node_modules/

# テストカバレッジ
coverage/

# 設定ファイル
*.config.js
```

**注意**: `.steering/` はMarkdownファイルなので、PrettierとESLintの対象に含めます

## ベストプラクティス

### コード配置の原則

1. **単一責任の原則**: 1ファイル1責務
2. **疎結合**: レイヤー間の依存を最小化
3. **高凝集**: 関連するコードは同じディレクトリに配置

### テストコードの配置

- テストコードは `tests/` ディレクトリに集約
- `src/` と同じディレクトリ構造を維持
- テストファイルは `.test.ts` または `.spec.ts` で終わる

### 型定義の共有

- 共通の型定義は `src/types/` に配置
- 各モジュール固有の型は、そのモジュール内に配置
- 型定義ファイルは他のファイルに依存しない

### ユーティリティ関数の配置

- 複数のレイヤーで使用される関数は `src/utils/` に配置
- 特定のレイヤーでのみ使用される関数は、そのレイヤー内に配置
- ユーティリティ関数は純粋関数として実装
