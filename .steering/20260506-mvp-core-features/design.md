# 設計書

## アーキテクチャ概要

```
ブラウザ
  └─ index.html (Viteエントリー)
      └─ src/main.tsx (Reactエントリー)
          └─ src/App.tsx (画面遷移管理)
              ├─ HomeScreen
              ├─ QuestListScreen
              ├─ QuestPlayScreen
              │   ├─ QuizContainer
              │   └─ PuzzleContainer
              ├─ CollectionScreen
              └─ DailyChallengeScreen

状態管理 (Zustand)
  ├─ uiStore   - 現在の画面、ナビゲーション
  ├─ progressStore - プレイヤー進捗 (ProgressManagerをラップ)
  └─ questStore    - 進行中のクエストセッション

既存サービス層 (変更なし)
  ├─ QuestManager
  ├─ QuizEngine
  ├─ PuzzleEngine
  ├─ ProgressManager
  └─ BadgeSystem
```

## 状態管理設計

### uiStore
```typescript
interface UiState {
  currentScreen: 'home' | 'quest-list' | 'quest-play' | 'collection' | 'daily-challenge';
  navigate: (screen: UiState['currentScreen']) => void;
}
```

### progressStore
```typescript
interface ProgressState {
  progress: PlayerProgress | null;
  isLoading: boolean;
  initProgress: () => void;
  updateProgress: (progress: PlayerProgress) => void;
  completeQuest: (questId: string, rewards: Reward[]) => void;
}
```

### questStore
```typescript
interface QuestState {
  availableQuests: Quest[];
  selectedQuest: Quest | null;
  currentSession: QuestSession | null;
  currentStepIndex: number;
  quizQuestions: QuizQuestion[];
  currentQuizIndex: number;
  quizResults: QuizResult[];
  puzzleData: PuzzleData | null;
  puzzleState: PuzzleState | null;
  questCompleted: boolean;
  // actions
  loadAvailableQuests: () => Promise<void>;
  selectQuest: (quest: Quest) => void;
  startQuest: () => Promise<void>;
  submitQuizAnswer: (selectedIndex: number) => QuizResult;
  nextQuiz: () => void;
  initializePuzzle: (puzzleData: PuzzleData) => Promise<void>;
  selectPuzzleStation: (stationId: string) => Promise<void>;
  submitPuzzle: () => Promise<PuzzleResult>;
  completeStep: (success: boolean, score: number) => void;
  resetQuest: () => void;
}
```

## コンポーネント設計

### HomeScreen
- ゲームタイトル「首都圏鉄道マスター」表示
- プレイヤーの進捗サマリー（レベル、クリア数）
- 「クエストを始める」ボタン → QuestListScreen
- 「コレクション」ボタン → CollectionScreen
- 「デイリーチャレンジ」ボタン → DailyChallengeScreen

### QuestListScreen
- 利用可能なクエスト一覧表示
- 各クエストカード: タイトル、説明、難易度、クリア状態
- クリア済みは「完了」バッジ表示
- 「戻る」ボタン → HomeScreen

### QuestPlayScreen
- クエストのステップ進行を管理
  - Step 0 (quiz): QuizContainerを表示
  - Step 1 (puzzle): PuzzleContainerを表示
  - Step 2 (challenge): チャレンジ（クイズの復習）を表示
- クエストクリア時に報酬モーダル表示

### QuizContainer
- 問題文表示
- 4択ボタン
- 回答後: 正解/不正解フィードバック + 解説
- 「次の問題」ボタン（最後は「パズルへ」ボタン）

### PuzzleContainer
- 路線図をSVGで表示
  - 駅: 丸（クリック可能）
  - 路線: 線（線の色で路線を区別）
  - スタート駅: 緑ハイライト
  - ゴール駅: 赤ハイライト
  - 選択済み経路: 太い線でハイライト
- 制約条件表示
- タイマー表示（カウントダウン）
- 「経路確定」ボタン（ゴールに到達したら有効）

### CollectionScreen
- 獲得バッジ一覧
- 総ポイント表示
- 「戻る」ボタン

### DailyChallengeScreen
- 今日のチャレンジクエスト表示
- 完了済みの場合は「本日のチャレンジは完了しました」
- 「チャレンジ開始」ボタン

## ファイル構造

```
src/
├── main.tsx
├── App.tsx
├── index.css (Tailwind)
├── stores/
│   ├── index.ts
│   ├── uiStore.ts
│   ├── progressStore.ts
│   └── questStore.ts
└── components/
    ├── common/
    │   ├── Button.tsx
    │   └── ProgressBar.tsx
    ├── screens/
    │   ├── HomeScreen.tsx
    │   ├── QuestListScreen.tsx
    │   ├── QuestPlayScreen.tsx
    │   ├── CollectionScreen.tsx
    │   └── DailyChallengeScreen.tsx
    ├── quiz/
    │   ├── QuizContainer.tsx
    │   └── QuizResult.tsx
    └── puzzle/
        └── PuzzleContainer.tsx

index.html (ルート)
vite.config.ts
tailwind.config.js
postcss.config.js
```

## 技術的注意事項

- サービス層のクラスはシングルトンとして`src/services/instances.ts`に定義
- PuzzleEngineはpuzzleDataをメモリに保持しないため、コンポーネント側でpuzzleDataを管理
- パズルのSVG: viewBox="0 0 300 100"、駅座標はpuzzleData.railwayMap.stationsから取得
  - sobu.jsonの座標: x=0,50,100 → SVG表示用にスケール調整 (x * 1 + padding)
- タイマー: setIntervalで1秒ごとに残り時間を減らす

## サービスのインスタンス化

```typescript
// src/services/instances.ts
import { RailwayDataRepository } from '../repositories/RailwayDataRepository';
import { QuizDataRepository } from '../repositories/QuizDataRepository';
import { PuzzleDataRepository } from '../repositories/PuzzleDataRepository';
import { PlayerDataRepository } from '../repositories/PlayerDataRepository';
import { QuestManager } from './QuestManager';
import { QuizEngine } from './QuizEngine';
import { PuzzleEngine } from './PuzzleEngine';
import { ProgressManager } from './ProgressManager';
import { BadgeSystem } from './BadgeSystem';
import { DailyChallengeManager } from './DailyChallengeManager';

const railwayRepo = new RailwayDataRepository();
const quizRepo = new QuizDataRepository(railwayRepo);
const puzzleRepo = new PuzzleDataRepository(railwayRepo);
const playerRepo = new PlayerDataRepository();

export const questManager = new QuestManager(railwayRepo, quizRepo, puzzleRepo);
export const quizEngine = new QuizEngine(quizRepo);
export const puzzleEngine = new PuzzleEngine(puzzleRepo, railwayRepo);
export const progressManager = new ProgressManager(playerRepo);
export const badgeSystem = new BadgeSystem();
export const dailyChallengeManager = new DailyChallengeManager();
```
