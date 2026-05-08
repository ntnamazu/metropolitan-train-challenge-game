# 開発ガイドライン (Development Guidelines)

このドキュメントは、首都圏鉄道マスタープロジェクトにおけるコーディング規約と開発プロセスを定義します。

## コーディング規約

### 命名規則

#### 変数・関数

**TypeScript/JavaScript**:
```typescript
// ✅ 良い例: 役割が明確
const questData = fetchQuestData();
const playerProgress = loadPlayerProgress();
function calculatePuzzleScore(timeTaken: number, timeLimit: number): number { }

// ❌ 悪い例: 曖昧
const data = fetch();
function calc(t: number, l: number): number { }
```

**原則**:
- **変数**: camelCase、名詞または名詞句
- **関数**: camelCase、動詞で始める
- **定数**: UPPER_SNAKE_CASE
- **Boolean**: `is`, `has`, `should`, `can`で始める

**例**:
```typescript
// 変数
const userName = 'John';
const taskList = [];
const questSession = createQuestSession();

// 関数
function fetchRailwayData() { }
function validateQuizAnswer() { }
function calculateScore() { }

// 定数
const MAX_QUIZ_TIME = 60;
const DEFAULT_LEVEL = 1;
const API_BASE_URL = '/api';

// Boolean
const isCompleted = true;
const hasPermission = false;
const shouldRetry = true;
const canPlay = false;
```

#### クラス・インターフェース

```typescript
// クラス: PascalCase、名詞
class QuestManager { }
class QuizEngine { }
class PuzzleEngine { }
class RailwayDataRepository { }

// インターフェース: PascalCase
interface Quest { }
interface QuizQuestion { }
interface PuzzleData { }

// 型エイリアス: PascalCase
type DifficultyLevel = 1 | 2 | 3 | 4;
type PuzzleType = 'route_selection' | 'transfer_puzzle';
type QuizCategory = 'station_name' | 'line_name';
```

#### ファイル名

```typescript
// Reactコンポーネント: PascalCase + .tsx
// QuizContainer.tsx
// StationNode.tsx
// BadgeCard.tsx

// サービス・リポジトリクラス: PascalCase + .ts
// QuestManager.ts
// QuizEngine.ts
// RailwayDataRepository.ts

// カスタムHook: use + PascalCase + .ts
// useQuest.ts
// useTimer.ts
// usePuzzle.ts

// 型定義: kebab-case + .ts
// quest.ts
// quiz.ts
// railway.ts

// ユーティリティ関数: kebab-case + .ts
// date.ts
// storage.ts
// validation.ts

// Zustand Store: camelCase + Store.ts
// questStore.ts
// progressStore.ts
```

### コードフォーマット

**インデント**: 2スペース

**行の長さ**: 最大100文字

**例**:
```typescript
// TypeScript コードフォーマット例
function createQuest(
  title: string,
  description: string,
  level: DifficultyLevel
): Quest {
  return {
    id: generateId(),
    title,
    description,
    level,
    createdAt: new Date(),
  };
}
```

### コメント規約

#### ドキュメントコメント (TSDoc)

**関数・クラスのドキュメント**:
```typescript
/**
 * クイズの採点を行う
 *
 * @param questionId - 問題ID
 * @param selectedIndex - ユーザーが選択した選択肢のインデックス (0-3)
 * @returns 採点結果 (正解/不正解、正解のインデックス、解説)
 * @throws {ValidationError} 選択肢のインデックスが不正な場合
 */
function submitAnswer(
  questionId: string,
  selectedIndex: number
): QuizResult {
  // 実装
}
```

#### インラインコメント

**良いコメント**:
```typescript
// ✅ 良い例: なぜそうするかを説明
// キャッシュを無効化して、最新の路線データを取得
cache.clear();

// ✅ 複雑なロジックを説明
// Kadaneのアルゴリズムで最大部分配列和を計算
// 時間計算量: O(n)
let maxSoFar = arr[0];
let maxEndingHere = arr[0];

// ✅ TODO・FIXMEを活用
// TODO: ランキング機能を実装 (Issue #123)
// FIXME: 大量データでパフォーマンス劣化 (Issue #456)
// HACK: 一時的な回避策、後でリファクタリング必要
```

**悪いコメント**:
```typescript
// ❌ 悪い例: コードの内容を繰り返すだけ
// スコアを計算する
const score = calculateScore();

// ❌ 古い情報
// このコードは2025年に追加された (不要な情報)

// ❌ コメントアウトされたコード
// const oldImplementation = () => { ... };  // 削除すべき
```

### エラーハンドリング

#### カスタムエラークラス

```typescript
// エラークラス定義
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(
    public resource: string,
    public id: string
  ) {
    super(`${resource} not found: ${id}`);
    this.name = 'NotFoundError';
  }
}

class StorageError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'StorageError';
    this.cause = cause;
  }
}
```

#### エラーハンドリングパターン

```typescript
// ✅ 良い例: 適切なエラーハンドリング
async function getQuest(questId: string): Promise<Quest> {
  try {
    const quest = await questRepository.findById(questId);

    if (!quest) {
      throw new NotFoundError('Quest', questId);
    }

    return quest;
  } catch (error) {
    if (error instanceof NotFoundError) {
      // 予期されるエラー: 適切に処理
      console.warn(`クエストが見つかりません: ${questId}`);
      throw error;
    }

    // 予期しないエラー: ラップして上位に伝播
    throw new StorageError('クエストの取得に失敗しました', error as Error);
  }
}

// ❌ 悪い例: エラーを無視
async function getQuest(questId: string): Promise<Quest | null> {
  try {
    return await questRepository.findById(questId);
  } catch (error) {
    return null; // エラー情報が失われる
  }
}
```

#### 非同期エラーとネットワークエラーのハンドリング

```typescript
// ネットワークエラーのハンドリング
class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public cause?: Error
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

// ✅ 良い例: ネットワークエラーを適切にハンドリング
async function robustFetch(url: string): Promise<Response> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new NetworkError(
        `HTTPエラー: ${response.status} ${response.statusText}`,
        response.status
      );
    }
    
    return response;
  } catch (error) {
    if (error instanceof NetworkError) {
      throw error;
    }
    
    // fetch自体の失敗 (ネットワーク切断など)
    throw new NetworkError(
      'ネットワークエラーが発生しました',
      undefined,
      error as Error
    );
  }
}

// グローバルエラーハンドラー (main.tsxなどで設定)
window.addEventListener('unhandledrejection', (event) => {
  console.error('未処理のPromise拒否:', event.reason);
  // 本番環境ではSentryなどのエラー追跡サービスに送信
  // Sentry.captureException(event.reason);
});

window.addEventListener('error', (event) => {
  console.error('未処理のエラー:', event.error);
  // Sentry.captureException(event.error);
});
```

#### エラーメッセージ

```typescript
// ✅ 良い例: 具体的で解決策を示す
throw new ValidationError(
  'クイズの選択肢は0-3の範囲で指定してください。入力値: 5',
  'selectedIndex',
  5
);

// ❌ 悪い例: 曖昧で役に立たない
throw new Error('Invalid input');
```

### 関数設計

#### 単一責務の原則

```typescript
// ✅ 良い例: 単一の責務
function calculatePuzzleScore(timeTaken: number, timeLimit: number): number {
  const timeRatio = 1 - (timeTaken / timeLimit);
  return Math.floor(timeRatio * 100);
}

function formatScore(score: number): string {
  return `${score}点`;
}

// ❌ 悪い例: 複数の責務
function calculateAndFormatScore(timeTaken: number, timeLimit: number): string {
  const timeRatio = 1 - (timeTaken / timeLimit);
  const score = Math.floor(timeRatio * 100);
  return `${score}点`;
}
```

#### 関数の長さ

- **目標**: 20行以内
- **推奨**: 50行以内
- **100行以上**: リファクタリングを検討

#### パラメータの数

```typescript
// ✅ 良い例: オブジェクトでまとめる
interface CreateQuestOptions {
  title: string;
  description: string;
  level: DifficultyLevel;
  railwayLine: string;
  steps: QuestStep[];
}

function createQuest(options: CreateQuestOptions): Quest {
  // 実装
}

// ❌ 悪い例: パラメータが多すぎる
function createQuest(
  title: string,
  description: string,
  level: DifficultyLevel,
  railwayLine: string,
  steps: QuestStep[]
): Quest {
  // 実装
}
```

### 非同期処理

#### async/await の使用

```typescript
// ✅ 良い例: async/await
async function loadQuestData(questId: string): Promise<Quest> {
  try {
    const quest = await questRepository.findById(questId);
    const quizData = await quizRepository.findByQuestId(questId);
    return { ...quest, quizzes: quizData };
  } catch (error) {
    console.error('クエストデータの読み込みに失敗', error);
    throw error;
  }
}

// ❌ 悪い例: Promiseチェーン
function loadQuestData(questId: string): Promise<Quest> {
  return questRepository.findById(questId)
    .then(quest => quizRepository.findByQuestId(questId)
      .then(quizData => ({ ...quest, quizzes: quizData })))
    .catch(error => {
      console.error('クエストデータの読み込みに失敗', error);
      throw error;
    });
}
```

#### 並列処理

```typescript
// ✅ 良い例: Promise.allで並列実行
async function loadMultipleQuests(questIds: string[]): Promise<Quest[]> {
  const promises = questIds.map(id => questRepository.findById(id));
  return Promise.all(promises);
}

// ❌ 悪い例: 逐次実行
async function loadMultipleQuests(questIds: string[]): Promise<Quest[]> {
  const quests: Quest[] = [];
  for (const id of questIds) {
    const quest = await questRepository.findById(id); // 遅い
    quests.push(quest);
  }
  return quests;
}
```

## Git運用ルール

### ブランチ戦略（Git Flow）

**Git Flowとは**:
Vincent Driessenが提唱した、機能開発・リリース・ホットフィックスを体系的に管理するブランチモデル。明確な役割分担により、チーム開発での並行作業と安定したリリースを実現します。

**ブランチ構成**:
```
main (本番環境)
└── develop (開発・統合環境)
    ├── feature/* (新機能開発)
    ├── fix/* (バグ修正)
    └── refactor/* (リファクタリング)
```

**運用ルール**:
- **main**: 本番リリース済みの安定版コードのみを保持。タグでバージョン管理
- **develop**: 次期リリースに向けた最新の開発コードを統合。CIでの自動テスト実施
- **feature/\*、fix/\*、refactor/\***: developから分岐し、作業完了後にPRでdevelopへマージ
- **直接コミット禁止**: すべてのブランチでPRレビューを必須とし、コード品質を担保
- **マージ方針**: feature→develop は squash merge、develop→main は merge commit を推奨

**ブランチ命名規則**:
```bash
# 新機能
feature/quest-daily-challenge
feature/puzzle-time-limit

# バグ修正
fix/quiz-validation-error
fix/puzzle-path-check

# リファクタリング
refactor/quest-manager
refactor/data-layer
```

**実際の運用手順**:
```bash
# 1. 最新のdevelopブランチに更新
git checkout develop
git pull origin develop

# 2. 新しい機能ブランチを作成
git checkout -b feature/quest-daily-challenge

# 3. 実装作業を行う
# ...コード編集...

# 4. 変更をコミット
git add .
git commit -m "feat(quest): デイリーチャレンジ機能を追加"

# 5. リモートにプッシュ
git push -u origin feature/quest-daily-challenge

# 6. プルリクエストを作成 (GitHub CLI使用)
gh pr create --base develop --title "デイリーチャレンジ機能を追加" --body "..."

# 7. レビュー承認後、マージ (GitHub UI または CLI)
# developブランチへはsquash mergeを推奨
```

### コミットメッセージ規約

**Conventional Commitsを採用**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type一覧**:
```
feat: 新機能
fix: バグ修正
docs: ドキュメント
style: コードフォーマット
refactor: リファクタリング
perf: パフォーマンス改善
test: テスト追加・修正
build: ビルドシステム
ci: CI/CD設定
chore: その他 (依存関係更新など)
```

**良いコミットメッセージの例**:

```
feat(quest): デイリーチャレンジ機能を追加

毎日異なるクエストに挑戦できるデイリーチャレンジ機能を実装しました。

実装内容:
- DailyChallengeManagerクラスを追加
- 日付ごとのクエスト選択ロジック
- ボーナスポイント付与機能

Closes #45
```

### プルリクエストプロセス

**作成前のチェック**:
- [ ] 全てのテストがパス (`npm run test`)
- [ ] Lintエラーがない (`npm run lint`)
- [ ] 型チェックがパス (`npm run typecheck`)
- [ ] ビルドが成功する (`npm run build`)
- [ ] 競合が解決されている

**PRテンプレート**:
```markdown
## 変更の種類
- [ ] 新機能 (feat)
- [ ] バグ修正 (fix)
- [ ] リファクタリング (refactor)
- [ ] ドキュメント (docs)
- [ ] その他 (chore)

## 変更内容
### 何を変更したか
[簡潔な説明]

### なぜ変更したか
[背景・理由]

### どのように変更したか
- [変更点1]
- [変更点2]

## テスト
### 実施したテスト
- [ ] ユニットテスト追加
- [ ] 統合テスト追加
- [ ] ブラウザでの手動テスト実施

### テスト結果
[テスト結果の説明]

## スクリーンショット(該当する場合)
[画像]

## 関連Issue
Closes #[番号]

## レビューポイント
[レビュアーに特に見てほしい点]
```

**レビュープロセス**:
1. セルフレビュー
2. 自動テスト実行 (CI)
3. レビュアーアサイン
4. レビューフィードバック対応
5. 承認後マージ

## テスト戦略

### テストの種類

#### ユニットテスト

**対象**: 個別の関数・クラス

**カバレッジ目標**: 80%以上

**例**:
```typescript
describe('QuizEngine', () => {
  describe('submitAnswer', () => {
    it('正解の選択肢を選んだ場合、correctがtrueを返す', () => {
      // Given: 準備
      const engine = new QuizEngine();
      const question: QuizQuestion = {
        id: 'q1',
        question: '山手線の駅は何駅？',
        choices: ['28駅', '29駅', '30駅', '31駅'],
        correctIndex: 2,
        explanation: '山手線は30駅です',
        category: 'station_name',
        difficulty: 1,
      };

      // When: 実行
      const result = engine.submitAnswer(question, 2);

      // Then: 検証
      expect(result.correct).toBe(true);
      expect(result.correctIndex).toBe(2);
      expect(result.explanation).toBe('山手線は30駅です');
    });

    it('不正解の選択肢を選んだ場合、correctがfalseを返す', () => {
      // Given: 準備
      const engine = new QuizEngine();
      const question: QuizQuestion = {
        id: 'q1',
        question: '山手線の駅は何駅？',
        choices: ['28駅', '29駅', '30駅', '31駅'],
        correctIndex: 2,
        explanation: '山手線は30駅です',
        category: 'station_name',
        difficulty: 1,
      };

      // When: 実行
      const result = engine.submitAnswer(question, 1);

      // Then: 検証
      expect(result.correct).toBe(false);
      expect(result.correctIndex).toBe(2);
    });
  });
});
```

#### 統合テスト

**対象**: 複数コンポーネントの連携

**例**:
```typescript
describe('Quest Flow', () => {
  it('クエストを開始してクリアまでの流れが正しく動作する', async () => {
    // Given: 準備
    const questManager = new QuestManager(
      questRepository,
      quizRepository,
      puzzleRepository
    );
    const progressManager = new ProgressManager(playerDataRepository);

    // When: クエストを開始
    const session = await questManager.startQuest('quest-yamanote-01');
    expect(session.currentStepIndex).toBe(0);

    // When: クイズステップをクリア
    const quizResult = await questManager.completeStep(session.sessionId, {
      stepIndex: 0,
      success: true,
      score: 100,
    });
    expect(quizResult.currentStepIndex).toBe(1);

    // When: パズルステップをクリア
    const puzzleResult = await questManager.completeStep(session.sessionId, {
      stepIndex: 1,
      success: true,
      score: 90,
    });
    expect(puzzleResult.completed).toBe(true);

    // Then: 報酬を受け取る
    const rewards = await questManager.completeQuest(session.sessionId);
    expect(rewards.length).toBeGreaterThan(0);

    // Then: 進捗が保存される
    const progress = await progressManager.loadProgress();
    expect(progress.completedQuestIds).toContain('quest-yamanote-01');
  });
});
```

#### コンポーネントテスト (React)

**対象**: Reactコンポーネントのレンダリングとインタラクション

**実行方法**:
```bash
# コンポーネントテスト単体実行
npm run test -- --testPathPattern=components

# または全テスト実行に含まれる
npm run test
```

**例**:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizContainer } from './QuizContainer';

describe('QuizContainer', () => {
  it('クイズ問題が表示される', () => {
    // Given: 準備
    const question: QuizQuestion = {
      id: 'q1',
      question: '山手線の駅は何駅？',
      choices: ['28駅', '29駅', '30駅', '31駅'],
      correctIndex: 2,
      explanation: '山手線は30駅です',
      category: 'station_name',
      difficulty: 1,
    };

    // When: レンダリング
    render(<QuizContainer question={question} onAnswer={() => {}} />);

    // Then: 問題文と選択肢が表示される
    expect(screen.getByText('山手線の駅は何駅？')).toBeInTheDocument();
    expect(screen.getByText('28駅')).toBeInTheDocument();
    expect(screen.getByText('30駅')).toBeInTheDocument();
  });

  it('選択肢をクリックすると回答が送信される', () => {
    // Given: 準備
    const question: QuizQuestion = {
      id: 'q1',
      question: '山手線の駅は何駅？',
      choices: ['28駅', '29駅', '30駅', '31駅'],
      correctIndex: 2,
      explanation: '山手線は30駅です',
      category: 'station_name',
      difficulty: 1,
    };
    const onAnswer = jest.fn();

    // When: レンダリングして選択肢をクリック
    render(<QuizContainer question={question} onAnswer={onAnswer} />);
    const choice = screen.getByText('30駅');
    fireEvent.click(choice);

    // Then: onAnswerが呼ばれる
    expect(onAnswer).toHaveBeenCalledWith(2);
  });
});
```

### テスト命名規則

**パターン**: 日本語で明確に説明

**例**:
```typescript
// ✅ 良い例: 分かりやすい
it('正解の選択肢を選んだ場合、correctがtrueを返す', () => { });
it('不正解の選択肢を選んだ場合、correctがfalseを返す', () => { });
it('タイトルが空の場合、ValidationErrorをスローする', () => { });

// ❌ 悪い例: 曖昧
it('test1', () => { });
it('works', () => { });
it('should work correctly', () => { });
```

### カバレッジ目標

```json
// vitest.config.ts
{
  "test": {
    "coverage": {
      "provider": "v8",
      "reporter": ["text", "html", "lcov"],
      "threshold": {
        "global": {
          "branches": 80,
          "functions": 80,
          "lines": 80,
          "statements": 80
        },
        "src/services/": {
          "branches": 90,
          "functions": 90,
          "lines": 90,
          "statements": 90
        }
      }
    }
  }
}
```

**理由**:
- 重要なビジネスロジック (services/) は高いカバレッジを要求
- UI層 (components/) は低めでも許容
- 100%を目指さない (コストと効果のバランス)

## コードレビュー基準

### レビューポイント

**機能性**:
- [ ] 要件を満たしているか
- [ ] エッジケースが考慮されているか
- [ ] エラーハンドリングが適切か

**可読性**:
- [ ] 命名が明確か
- [ ] コメントが適切か
- [ ] 複雑なロジックが説明されているか

**保守性**:
- [ ] 重複コードがないか
- [ ] 責務が明確に分離されているか
- [ ] 変更の影響範囲が限定的か

**パフォーマンス**:
- [ ] 不要な計算がないか
- [ ] メモリリークの可能性がないか
- [ ] 遅延読み込みが適切に使われているか

**セキュリティ**:
- [ ] 入力検証が適切か
- [ ] 機密情報がハードコードされていないか
- [ ] XSS対策がされているか

### レビューコメントの書き方

**建設的なフィードバック**:
```markdown
## ✅ 良い例
この実装だと、路線データが増えた時にパフォーマンスが劣化する可能性があります。
代わりに、Mapを使った検索を検討してはどうでしょうか？

```typescript
const stationMap = new Map(stations.map(s => [s.id, s]));
const station = stationMap.get(stationId); // O(1)
```

## ❌ 悪い例
この書き方は良くないです。
```

**優先度の明示**:
- `[必須]`: 修正必須
- `[推奨]`: 修正推奨
- `[提案]`: 検討してほしい
- `[質問]`: 理解のための質問

**例**:
```markdown
[必須] セキュリティ: ユーザー入力がサニタイズされていません
[推奨] パフォーマンス: ループ内でのデータ取得を避けましょう
[提案] 可読性: この関数名をもっと明確にできませんか？
[質問] この処理の意図を教えてください
```

### レビュー時間の目安

- **小規模PR (100行以下)**: 15分
- **中規模PR (100-300行)**: 30分
- **大規模PR (300行以上)**: 1時間以上

**原則**: 大規模PRは避け、分割する

## 開発環境セットアップ

### 必要なツール

| ツール | バージョン | インストール方法 |
|--------|-----------|-----------------|
| Node.js | v24.11.0 | https://nodejs.org/ |
| npm | 11.x | Node.jsに同梱 |
| Git | 最新版 | https://git-scm.com/ |

### セットアップ手順

```bash
# 1. リポジトリのクローン
git clone <repository-url>
cd railway-game

# 2. 依存関係のインストール
npm install

# 3. 開発サーバーの起動
npm run dev
```

### 推奨開発ツール

- **VS Code**: 推奨エディタ
  - 拡張機能: ESLint, Prettier, TypeScript
- **Chrome DevTools**: デバッグ
- **React Developer Tools**: Reactコンポーネントのデバッグ

### npm scripts

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# ビルド結果のプレビュー
npm run preview

# Lintチェック
npm run lint

# Lint自動修正
npm run lint:fix

# 型チェック
npm run typecheck

# テスト実行
npm run test

# テスト (ウォッチモード)
npm run test:watch

# カバレッジ付きテスト
npm run test:coverage

# コードフォーマット
npm run format
```

## 自動化の推進

### 品質チェックの自動化

**自動化項目と採用ツール**:

1. **Lintチェック**: ESLint 9.x + @typescript-eslint
   - TypeScript専用ルールセットでコーディング規約を統一
   - 潜在的なバグや非推奨パターンを自動検出

2. **コードフォーマット**: Prettier 3.x
   - コードスタイルを自動整形し、レビュー時の議論を削減

3. **型チェック**: TypeScript Compiler (tsc) 5.x
   - `tsc --noEmit`で型エラーのみをチェック

4. **テスト実行**: Vitest 2.x
   - Viteベースで高速起動・実行
   - カバレッジ測定が標準搭載

5. **ビルド確認**: Vite
   - 本番ビルドが成功するか確認

### CI/CD (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build
```

### Pre-commit フック (Husky 9.x + lint-staged)

```json
// package.json
{
  "scripts": {
    "prepare": "husky",
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
npm run lint-staged
npm run typecheck
```

**導入効果**:
- コミット前に自動チェックが走り、不具合コードの混入を防止
- PR作成時に自動でCI実行され、マージ前に品質を担保
- 早期発見により、修正コストを最大80%削減

## サードパーティ画像の利用ガイドライン

路線写真など外部ソースの画像を使用する場合のルール。

### 使用できるライセンス

| ライセンス | 商用利用 | 使用可否 |
|-----------|---------|---------|
| CC0 (パブリックドメイン) | ✅ | ✅ 使用可 |
| CC BY | ✅ | ✅ 使用可 |
| CC BY-SA | ✅ | ✅ 使用可 |
| CC BY-NC | ❌ | ❌ 使用不可 (非商用限定) |
| CC BY-NC-SA | ❌ | ❌ 使用不可 (非商用限定) |
| 著作権あり | - | ❌ 使用不可 |

将来的な収益化を妨げないよう、商用利用可能なライセンスのみを使用すること。

### 画像データの登録方法

路線JSONの `quizPhotos` / `feedbackPhotos` / `unlockPhoto` に以下のフィールドをすべて記録する:

```json
{
  "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/...",
  "photographer": "撮影者名 (Wikimedia Commonsに記載の名前を使用)",
  "license": "CC BY-SA",
  "licenseVersion": "4.0",
  "commonsPageUrl": "https://commons.wikimedia.org/wiki/File:..."
}
```

**確認手順**:
1. Wikimedia CommonsのファイルページでライセンスとPhotographerを確認する
2. `commonsPageUrl` にはファイルページのURLを記録する (画像の直URLではなく)
3. CC0の場合でも `photographer` と `commonsPageUrl` は記録する

## 実装完了前チェックリスト

実装完了前に確認:

### コード品質
- [ ] 命名が明確で一貫している
- [ ] 関数が単一の責務を持っている
- [ ] マジックナンバーがない
- [ ] 型注釈が適切に記載されている
- [ ] エラーハンドリングが実装されている

### セキュリティ
- [ ] 入力検証が実装されている
- [ ] 機密情報がハードコードされていない
- [ ] XSS対策がされている

### パフォーマンス
- [ ] 適切なデータ構造を使用している
- [ ] 不要な計算を避けている
- [ ] 遅延読み込みが適切に使われている

### テスト
- [ ] ユニットテストが書かれている
- [ ] テストがパスする
- [ ] エッジケースがカバーされている

### ドキュメント
- [ ] 関数・クラスにTSDocコメントがある
- [ ] 複雑なロジックにコメントがある
- [ ] TODOやFIXMEが記載されている (該当する場合)

### ツール
- [ ] Lintエラーがない
- [ ] 型チェックがパスする
- [ ] フォーマットが統一されている
- [ ] ビルドが成功する
