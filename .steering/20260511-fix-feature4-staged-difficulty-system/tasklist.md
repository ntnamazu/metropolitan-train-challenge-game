# タスクリスト

## 🚨 タスク完全完了の原則

**このファイルの全タスクが完了するまで作業を継続すること**

### 必須ルール
- **全てのタスクを`[x]`にすること**
- 「時間の都合により別タスクとして実施予定」は禁止
- 未完了タスク（`[ ]`）を残したまま作業を終了しない

---

## フェーズ1: 型定義変更

- [x] `src/types/player.ts` に `completedQuestsByLevel` フィールドを追加
  - [x] `PlayerProgress` インターフェースに `completedQuestsByLevel?: Record<number, string[]>` を追加

## フェーズ2: データファイル作成

- [x] `public/data/railways/index.json` を作成（路線マニフェスト）
  - [x] sobu.json, yamanote.json, tobu-kamedo.json を含むリストを作成

- [x] `public/data/railways/jr/yamanote.json` を作成（山手線データ）
  - [x] 6駅（渋谷・原宿・代々木・新宿・新大久保・高田馬場）のStation定義
  - [x] RailwayLine 定義（color=#9ACD32, company=JR東日本, quizPhotos=[], feedbackPhotos=[], unlockPhoto なし）
  - [x] 5本の Connection を定義

- [x] `public/data/quizzes/level2/yamanote-quiz.json` を作成
  - [x] 3問のクイズを作成（路線カラー・運営会社・環状線の特徴など）

- [x] `public/data/puzzles/level2/yamanote-puzzle-01.json` を作成
  - [x] 渋谷→新宿のルート選択パズル
  - [x] timeLimit: 60, correctPath を定義

- [x] `public/data/quests/level2/quest-yamanote-01.json` を作成
  - [x] level: 2, railwayLine: "line-yamanote" を設定
  - [x] rewards に railway_line と vehicle_card と points を含める
  - [x] unlockCondition: { requiredLevel: 2 } を設定

## フェーズ3: リポジトリ修正

- [x] `src/repositories/RailwayDataRepository.ts` を修正
  - [x] `loadRailwayMap` を index.json マニフェストから動的ロードに変更
  - [x] Promise.all で並列フェッチ、結果をマージ

- [x] `src/repositories/QuizDataRepository.ts` を修正
  - [x] `loadQuizzesByQuestId(questId, level = 1)` にデフォルト付きレベルパラメータを追加
  - [x] フェッチパスを `level${level}/` に変更

- [x] `src/repositories/PuzzleDataRepository.ts` を修正
  - [x] `loadPuzzleByQuestId(questId, level = 1)` にデフォルト付きレベルパラメータを追加
  - [x] フェッチパスを `level${level}/` に変更

## フェーズ4: サービス修正

- [x] `src/services/QuestManager.ts` を修正
  - [x] `levelQuestIds` レジストリ（レベル1〜4のクエストIDマップ）を追加
  - [x] `findQuestLevel(questId)` プライベートメソッドを追加
  - [x] `loadQuest` を `findQuestLevel` で正しいレベルパスを組み立てるよう修正
  - [x] `getAvailableQuests` を `levelQuestIds[level]` を使うよう修正

- [x] `src/services/ProgressManager.ts` を修正
  - [x] `countCompletedQuestsByLevel` を `completedQuestsByLevel` フィールドを使うよう修正
  - [x] 後方互換フォールバック（`completedQuestsByLevel` 未設定時は全クエストをレベル1とカウント）を実装
  - [x] `createInitialProgress` に `completedQuestsByLevel: {}` を追加

## フェーズ5: Store 修正

- [x] `src/stores/progressStore.ts` を修正
  - [x] `completeQuest` のシグネチャに `questLevel: DifficultyLevel` を追加
  - [x] `completedQuestsByLevel` を更新するロジックを追加

- [x] `src/stores/questStore.ts` を修正
  - [x] `loadAvailableQuests: (level?: DifficultyLevel) => Promise<void>` にシグネチャ変更
  - [x] `getAvailableQuests(level)` に level を渡すよう修正

## フェーズ6: UI コンポーネント修正

- [x] `src/components/screens/QuestPlayScreen.tsx` を修正
  - [x] `completeQuestProgress` 呼び出しに `selectedQuest.level` を追加
  - [x] `quizRepo.loadQuizzesByQuestId(quest.id, quest.level)` に level を追加
  - [x] `puzzleRepo.loadPuzzleByQuestId(selectedQuest.id, selectedQuest.level)` に level を追加

- [x] `src/components/screens/QuestListScreen.tsx` を修正
  - [x] `progress.currentLevel` を取得して `loadAvailableQuests(currentLevel)` に渡す
  - [x] useEffect の依存配列に `progress?.currentLevel` を追加

- [x] `src/components/screens/DailyChallengeScreen.tsx` を修正
  - [x] `progress.currentLevel` を取得して `loadAvailableQuests(currentLevel)` に渡す
  - [x] useEffect の依存配列に `progress?.currentLevel` を追加

## フェーズ7: テスト更新・追加

- [x] `tests/unit/src/services/ProgressManager.test.ts` を更新
  - [x] 既存テスト: `completedQuestsByLevel` なし（後方互換）で checkLevelUp が正常動作することを確認
  - [x] 新規テスト: `completedQuestsByLevel` ありでレベルアップ判定が正しいことを確認
  - [x] 新規テスト: レベル2クエストがレベル1カウントに混入しないことを確認

## フェーズ8: 品質チェックと修正

- [x] すべてのテストが通ることを確認
  - [x] `docker compose run --rm app npm test` (58 tests passed)
- [x] リントエラーがないことを確認
  - [x] `docker compose run --rm app npm run lint` (0 errors, 5 warnings は既存)
- [x] 型エラーがないことを確認
  - [x] `docker compose run --rm app npm run typecheck` (エラーなし)
- [x] ビルドが成功することを確認
  - [x] `docker compose build` (成功)

---

## 実装後の振り返り

### 実装完了日
2026-05-11

### 計画と実績の差分

**計画と異なった点**:
- 当初の調査では3箇所のバグとしていたが、実装中に `RailwayDataRepository`、`QuizDataRepository`、`PuzzleDataRepository` にも同種のハードコードが存在することが判明。合計7箇所の修正が必要だった。
- validation-validator サブエージェントから quiz データの `category: "route_name"` が型定義に存在しない値であることを指摘され、`"line_name"` に修正。設計書には記載できていなかった細部。

**新たに必要になったタスク**:
- `if (!level)` → `if (level === null)` への修正（型の意図明確化）
- `completedQuestsByLevel: {}` ケースのテスト追加

**技術的理由でスキップしたタスク**: なし（全タスク完了）

### 学んだこと

**技術的な学び**:
- 後方互換フォールバックの実装: `Object.keys(byLevel).length > 0` のチェックで新/旧データ構造を分岐。`undefined` と `{}` を同じ「未設定」として扱う設計が局所的で理解しやすい。
- `RailwayDataRepository` の `index.json` マニフェスト方式: 新路線追加時にコード変更が不要になり、スケーラビリティが向上した。
- `null` チェックには `!level` ではなく `level === null` を使うべき。`0` が falsy であることによるバグを防ぐ。

**プロセス上の改善点**:
- implementation-validator が quiz データの型不一致（`category: "route_name"`）を発見した。JSON データの型整合性は TypeScript の `as` キャストをすり抜けるため、スキーマ検証の仕組みが今後必要。
- 初期調査で「3箇所のバグ」と報告したが、実際は7箇所だった。コードレビュー時に `grep -r "level1"` などで同種の問題を横断的に検索する習慣が必要。

### 次回への改善提案
- レベル2クエストは現在1件のみ（PRD要件は5件以上でLv3アンロック可能）。コンテンツ追加は `QuestManager.levelQuestIds` に ID を追加するだけで対応可能。
- `RailwayDataRepository` のテストが存在しない。動的マニフェストロードのユニットテストを追加することを推奨。
- `QuestManager` コンストラクタの未使用リポジトリ引数（`_railwayDataRepository` 等）の整理は将来の技術的負債として残っている。
