# 設計: 機能5 デイリーチャレンジ

## アーキテクチャ方針

既存のレイヤードアーキテクチャを踏襲する。
- `DailyChallengeManager`（サービス層）は既存のままで修正不要
- `progressStore`（状態管理）にデイリーチャレンジ完了アクションを追加
- `DailyChallengeScreen`（UI）のハンドラを修正
- `QuestPlayScreen`（UI）でデイリーチャレンジ判定を追加

## 変更ファイル

### 1. `src/stores/progressStore.ts`
**追加アクション: `completeDailyChallenge(questId: string)`**
- `dailyChallengeManager.markAsCompleted(progress, questId)` を呼ぶ
- `dailyChallengeManager.awardBonusPoints(progress)` を呼ぶ
- `updateProgress` で保存

**修正アクション: `completeQuest`**
- クエスト完了後、`progress.dailyChallenge.questId === questId && !progress.dailyChallenge.completed` なら `completeDailyChallenge` を呼ぶ

### 2. `src/components/screens/DailyChallengeScreen.tsx`
**修正: `handleStart`**
- `dailyChallengeManager.resetIfNeeded(progress)` で日付チェック
- `progress.dailyChallenge.questId` に今日のクエストIDを設定
- `updateProgress` で保存してから quest 開始

### 3. `src/components/screens/QuestPlayScreen.tsx`
**修正: `RewardModal`**
- `isDailyChallenge` prop を追加
- デイリーチャレンジ時は「+100ポイントボーナス」メッセージを表示
- 「デイリーチャレンジへ戻る」ボタンで `daily-challenge` 画面へナビゲート

**修正: `QuestPlayScreen`**
- `progress.dailyChallenge.questId === selectedQuest?.id` でデイリーチャレンジ判定
- `RewardModal` に `isDailyChallenge` を渡す
- `onClose` を条件分岐: daily-challenge なら `navigate('daily-challenge')`

### 4. `tests/unit/src/services/DailyChallengeManager.test.ts` (新規)
以下のテストケースを追加:
- `getDailyQuest`: 同じ日付では同じクエストを返す
- `getDailyQuest`: 異なる日付では（可能性として）異なるクエストを返す
- `checkCompletion`: 今日完了済みなら true
- `checkCompletion`: 未完了なら false
- `checkCompletion`: 昨日の完了は false
- `markAsCompleted`: 完了フラグを true にし bonusPoints を 100 に設定
- `awardBonusPoints`: totalPoints にボーナスを加算
- `resetIfNeeded`: 日付が異なる場合リセット
- `resetIfNeeded`: 同じ日付ならリセットしない

## データフロー（デイリーチャレンジ完了時）

```
DailyChallengeScreen.handleStart
  → resetIfNeeded(progress)
  → progress.dailyChallenge.questId = quest.id
  → updateProgress(progress)
  → selectQuest(quest)
  → navigate('quest-play')

QuestPlayScreen.handleChallengeComplete
  → completeCurrentStep(true, 100)
  → completeQuest() [questStore]
  → completeQuestProgress(questId, rewards) [progressStore]
     → completeDailyChallenge(questId) [自動検出]
        → markAsCompleted(progress, questId)
        → awardBonusPoints(progress)
        → updateProgress(progress)
  → showRewardModal = true

RewardModal (isDailyChallenge=true)
  → ボーナスポイント表示
  → onClose → navigate('daily-challenge')

DailyChallengeScreen
  → progress更新により isCompleted = true
  → "本日のチャレンジは完了済みです" 表示
```
