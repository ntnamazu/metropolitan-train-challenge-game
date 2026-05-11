# タスクリスト: 機能5 デイリーチャレンジ

## タスク

- [x] T1: `progressStore.ts` に `completeDailyChallenge` アクションを追加
- [x] T2: `progressStore.ts` の `completeQuest` でデイリーチャレンジを自動検出・完了処理
- [x] T3: `DailyChallengeScreen.tsx` の `handleStart` を修正（resetIfNeeded・questId設定・updateProgress）
- [x] T4: `QuestPlayScreen.tsx` の `RewardModal` にデイリーチャレンジ対応を追加
- [x] T5: `DailyChallengeManager.test.ts` を新規作成（ユニットテスト）
- [x] T6 (追加): `DailyChallengeManager.getDailyQuest` に空配列ガードを追加
- [x] T7 (追加): `ProgressManager.createInitialProgress` の `bonusPoints: 0` → `100` に修正

## 申し送り事項

**実装完了日**: 2026-05-11

**計画と実績の差分**:
- T6・T7 は implementation-validator の検証で発見されたバグ修正として追加
- バッジ付与（PRD: "ポイントやバッジ"）は今回未実装。BadgeSystem が外部JSONファイル依存のため、デイリーチャレンジ専用バッジ条件の追加はスコープを超えると判断。`+100ポイント`のみで受け入れ条件を満たす形とした

**学んだこと**:
- Zustand の `get()` 再取得パターンが、`updateProgress` 後の最新ストート状態参照を保証するため重要
- `handleStart` で `updateProgress` → `navigate` の順序を守ることで、QuestPlayScreen が最新の `dailyChallenge.questId` を参照できる
- サービス層のメソッドは UI 側でガードしていても、自前でも空配列ガードを持つべき（防御的プログラミング）

**次回への改善提案**:
- `progressStore.completeQuest` の統合テスト追加（デイリーチャレンジ自動検出フローのカバレッジ向上）
- `BadgeSystem` に `daily_challenge_complete` 条件タイプを追加し、デイリーチャレンジ達成バッジを実装（機能6「実績バッジ」と合わせて対応）
- `functional-design.md` の `DailyChallengeManager` インターフェース記述を現在の実装に合わせて更新（`isCompleted` → `checkCompletion`、`complete` → `markAsCompleted + awardBonusPoints`）
