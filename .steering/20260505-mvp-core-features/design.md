# 設計書

## アーキテクチャ概要

レイヤードアーキテクチャを採用し、責務を明確に分離します:

```
UIレイヤー (components/)
  ↓
ゲームロジックレイヤー (services/)
  ↓
データレイヤー (repositories/)
  ↓
localStorage / 静的JSONファイル
```

## コンポーネント設計

### 1. RailwayDataRepository（データレイヤー）

**責務**:
- 路線データ（JR中央・総武線、東武亀戸線）の静的JSONファイルからの読み込み
- 駅・路線情報の提供
- 経路検証のための接続情報管理

**実装の要点**:
- `public/data/railways/jr/sobu.json`と`public/data/railways/private/tobu-kamedo.json`を読み込む
- 駅ID、路線ID、接続情報を型安全に扱う
- エラーハンドリング（JSONファイルが存在しない場合）

### 2. QuizDataRepository（データレイヤー）

**責務**:
- クイズデータ（レベル1）の静的JSONファイルからの読み込み
- クエストIDに紐づくクイズ問題の提供
- RailwayDataRepositoryから路線情報を参照

**実装の要点**:
- `public/data/quizzes/level1/`配下のJSONファイルを読み込む
- RailwayDataRepositoryに依存して路線情報を取得
- クイズのカテゴリ（駅名、路線名、所要時間など）を管理

### 3. PuzzleDataRepository（データレイヤー）

**責務**:
- パズルデータ（レベル1）の静的JSONファイルからの読み込み
- クエストIDに紐づくパズル問題の提供
- RailwayDataRepositoryから路線情報を参照

**実装の要点**:
- `public/data/puzzles/level1/`配下のJSONファイルを読み込む
- RailwayDataRepositoryに依存して路線図データを取得
- 出発駅、目的駅、制約条件を管理

### 4. PlayerDataRepository（データレイヤー）

**責務**:
- プレイヤー進捗データのlocalStorageへの保存/読み込み
- データのバックアップ管理（最新版+バックアップ1世代）
- データの整合性チェック

**実装の要点**:
- キー: `railway_game_progress`, `railway_game_progress_backup`
- 保存時に現在のデータをバックアップにコピー
- 読み込み時にバックアップからの復元機能

### 5. QuestManager（ゲームロジックレイヤー）

**責務**:
- クエストの読み込みと進行管理
- クエストセッションの作成・管理
- クリア判定と報酬付与
- レベル1のクエストデータの管理

**実装の要点**:
- クエストデータは`public/data/quests/level1/`から読み込む
- 各クエストは「クイズ」→「パズル」→「チャレンジ」の3ステップ
- クリア時にProgressManagerを呼び出して進捗を更新

### 6. QuizEngine（ゲームロジックレイヤー）

**責務**:
- クイズ問題の出題
- 回答の採点（正解/不正解判定）
- 解説の提供

**実装の要点**:
- QuizDataRepositoryからクイズデータを取得
- 選択肢のインデックス（0-3）をバリデーション
- 正解時と不正解時の異なるフィードバック

### 7. PuzzleEngine（ゲームロジックレイヤー）

**責務**:
- パズルの初期化
- 経路選択の検証
- 制約条件のチェック（駅数、乗り換え回数）
- スコア計算

**実装の要点**:
- PuzzleDataRepositoryからパズルデータを取得
- 経路の連続性チェック（駅が実際につながっているか）
- 時間制限の管理
- 制約条件の検証ロジック

### 8. ProgressManager（ゲームロジックレイヤー）

**責務**:
- プレイヤー進捗の保存/読み込み
- レベルアップ判定（レベル1→2）
- アンロック処理（路線、車両、バッジ）
- 統計情報の更新

**実装の要点**:
- PlayerDataRepositoryを使用してデータを永続化
- レベル1のクエストを3つクリアしたらレベル2をアンロック
- クエスト完了時に統計情報を更新

### 9. BadgeSystem（ゲームロジックレイヤー）

**責務**:
- バッジ獲得条件の判定
- 実績の記録
- バッジ定義の管理

**実装の要点**:
- バッジ定義は`public/data/badges.json`から読み込む
- プレイヤーの進捗に基づいて獲得可能なバッジを判定
- 獲得日時を記録

### 10. DailyChallengeManager（ゲームロジックレイヤー）

**責務**:
- 日付ごとのクエスト選択
- デイリーチャレンジの完了状態管理
- ボーナスポイント付与
- 午前0時のリセット処理

**実装の要点**:
- 日付（YYYY-MM-DD）をキーにクエストを選択
- 完了済みかどうかをPlayerDataに記録
- 日付が変わったら自動的にリセット

### 11. UIコンポーネント（UIレイヤー）

**責務**:
- 画面表示とユーザーインタラクション
- 各サービスクラスの呼び出し
- Zustandストアとの連携

**主要コンポーネント**:
- `HomeScreen.tsx`: ホーム画面
- `QuestListScreen.tsx`: クエスト一覧
- `QuestPlayScreen.tsx`: クエストプレイ中
- `QuizContainer.tsx`: クイズUI
- `PuzzleContainer.tsx`: パズルUI
- `CollectionScreen.tsx`: コレクション画面
- `DailyChallengeScreen.tsx`: デイリーチャレンジ画面

## データフロー

### クエストプレイのフロー
```
1. ユーザーがクエストを選択 (QuestListScreen)
2. QuestManagerがクエストを開始 (startQuest)
3. クエストセッション作成
4. ステップ1: QuizEngineがクイズを出題
5. ユーザーが回答
6. QuizEngineが採点
7. ステップ2: PuzzleEngineがパズルを初期化
8. ユーザーが経路を選択
9. PuzzleEngineが検証
10. ステップ3: チャレンジ（同様の流れ）
11. QuestManagerがクエスト完了を記録
12. ProgressManagerが進捗を保存
13. BadgeSystemがバッジ獲得を判定
14. 報酬を表示
```

### レベルアップのフロー
```
1. クエスト完了時にProgressManager.checkLevelUp()を呼び出し
2. 完了したクエスト数をカウント
3. レベル1のクエストが3つ以上なら→レベル2をアンロック
4. プレイヤーデータを更新（currentLevel: 2）
5. 新しい路線をアンロック
6. ユーザーに通知を表示
```

### デイリーチャレンジのフロー
```
1. DailyChallengeScreen表示時にDailyChallengeManager.getDailyQuest()を呼び出し
2. 今日の日付をキーにクエストを選択
3. 完了済みかどうかをチェック
4. 未完了なら→クエストを表示
5. 完了済みなら→「本日のチャレンジは完了済みです」を表示
6. クエストクリア時にボーナスポイントを付与
```

## エラーハンドリング戦略

### カスタムエラークラス

```typescript
class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`);
    this.name = 'NotFoundError';
  }
}

class StorageError extends Error {
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'StorageError';
    this.cause = cause;
  }
}

class ValidationError extends Error {
  constructor(message: string, field: string, value: unknown) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### エラーハンドリングパターン

- **JSONファイル読み込み失敗**: NotFoundErrorをスロー、ユーザーに「データの読み込みに失敗しました」を表示
- **localStorage書き込み失敗**: StorageErrorをスロー、バックアップから復元を試みる
- **無効な入力**: ValidationErrorをスロー、エラーメッセージを表示

## テスト戦略

### ユニットテスト
- QuizEngine.submitAnswer: 正解/不正解の判定
- PuzzleEngine.validatePath: 経路検証ロジック
- ProgressManager.checkLevelUp: レベルアップ判定
- BadgeSystem.checkBadgeConditions: バッジ獲得条件
- PlayerDataRepository.save/load: データ永続化

### 統合テスト
- クエストプレイフロー全体（開始→クイズ→パズル→クリア）
- レベルアップ処理（3クエストクリア→レベル2アンロック）
- デイリーチャレンジのリセット（日付変更時）

## 依存ライブラリ

MVPでは追加ライブラリは不要です。既存のスタックで実装可能:
- React 18.x
- Zustand 5.x
- Tailwind CSS 3.x
- TypeScript 5.x

## ディレクトリ構造

```
src/
├── types/
│   ├── index.ts           # 型定義のエクスポート
│   ├── quest.ts           # Quest, QuestStep, Reward, QuestSession
│   ├── quiz.ts            # QuizQuestion, QuizResult, QuizCategory
│   ├── puzzle.ts          # PuzzleData, PuzzleState, PuzzleResult
│   ├── railway.ts         # Station, RailwayLine, RailwayMap, Connection
│   ├── player.ts          # PlayerProgress, Badge, DailyChallengeProgress
│   └── common.ts          # DifficultyLevel, その他共通型
├── repositories/
│   ├── RailwayDataRepository.ts
│   ├── QuizDataRepository.ts
│   ├── PuzzleDataRepository.ts
│   └── PlayerDataRepository.ts
├── services/
│   ├── QuestManager.ts
│   ├── QuizEngine.ts
│   ├── PuzzleEngine.ts
│   ├── ProgressManager.ts
│   ├── BadgeSystem.ts
│   └── DailyChallengeManager.ts
├── stores/
│   ├── questStore.ts
│   ├── progressStore.ts
│   └── uiStore.ts
├── components/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── QuestListScreen.tsx
│   │   ├── QuestPlayScreen.tsx
│   │   ├── CollectionScreen.tsx
│   │   └── DailyChallengeScreen.tsx
│   ├── quiz/
│   │   ├── QuizContainer.tsx
│   │   ├── QuizQuestion.tsx
│   │   └── QuizResult.tsx
│   ├── puzzle/
│   │   ├── PuzzleContainer.tsx
│   │   ├── RailwayMap.tsx
│   │   └── PathDisplay.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── ProgressBar.tsx
├── App.tsx
└── main.tsx

public/data/
├── railways/
│   ├── jr/
│   │   └── sobu.json
│   └── private/
│       └── tobu-kamedo.json
├── quizzes/
│   └── level1/
│       ├── sobu-quiz.json
│       └── tobu-kamedo-quiz.json
├── puzzles/
│   └── level1/
│       ├── sobu-puzzle-01.json
│       └── tobu-kamedo-puzzle-01.json
├── quests/
│   └── level1/
│       ├── quest-sobu-01.json
│       └── quest-tobu-kamedo-01.json
└── badges.json

tests/unit/src/
├── services/
│   ├── QuizEngine.test.ts
│   ├── PuzzleEngine.test.ts
│   └── ProgressManager.test.ts
└── repositories/
    └── PlayerDataRepository.test.ts

tests/integration/
├── quest-flow.test.ts
├── level-up.test.ts
└── daily-challenge.test.ts
```

## 実装の順序

1. **型定義の作成** (types/)
2. **データレイヤーの実装** (repositories/)
3. **ゲームロジックレイヤーの実装** (services/)
4. **状態管理の実装** (stores/)
5. **UIコンポーネントの実装** (components/)
6. **静的データファイルの作成** (public/data/)
7. **ユニットテストの作成** (tests/unit/)
8. **統合テストの作成** (tests/integration/)

## セキュリティ考慮事項

- ユーザー入力は最小限（クイズの選択肢インデックス、パズルの駅選択のみ）
- すべての入力をバリデーション（範囲チェック、型チェック）
- localStorage のSame-Origin Policyにより、他のドメインからのアクセスは不可
- XSS対策: Reactの標準エスケープ機能のみ使用、`dangerouslySetInnerHTML`は使用しない

## パフォーマンス考慮事項

- 路線データは初回読み込み時にメモリキャッシュ（アプリケーション起動中保持）
- クイズ/パズルデータは必要な時のみロード（遅延読み込み）
- プレイヤーデータの保存は非同期処理（try-catchで例外ハンドリング）
- 路線図のSVG描画は軽量化（最小限の駅とラインのみ）

## 将来の拡張性

- レベル2以降の路線データは同じ構造で追加可能
- 新しいパズルタイプは`PuzzleType`を拡張して追加
- 新しいバッジはbadges.jsonに定義を追加するだけ
- ランキングシステムはバックエンドAPIを追加して実装可能（現在のデータ構造は維持）
