# 要求内容: 機能5 デイリーチャレンジ

## 実装対象機能

PRD「機能5: デイリーチャレンジ」の受け入れ条件を満たす実装を行う。

## 受け入れ条件（PRDより）

- [ ] 毎日異なる路線のクエストが提示される
- [ ] デイリーチャレンジは1日1回までプレイ可能
- [ ] クリアするとログインボーナス（ポイントやバッジ）が獲得できる
- [ ] 毎日午前0時にリセットされる

## 既存実装の状況

### 実装済み
- `DailyChallengeManager` サービス（getDailyQuest, checkCompletion, markAsCompleted, awardBonusPoints, resetIfNeeded）
- `DailyChallengeScreen` コンポーネント（基本UI）
- `DailyChallengeProgress` 型定義
- ホーム画面からのナビゲーション

### 未実装・不完全な部分
1. `dailyChallenge.questId` がプログレスに保存されない（クエスト開始前に設定必要）
2. `resetIfNeeded` が呼ばれていない（日付変更時のリセットが機能しない）
3. クエスト完了時にボーナスポイントが付与されない
4. クエスト完了後に「デイリーチャレンジ完了」としてマークされない
5. デイリーチャレンジ完了時の特別な報酬表示がない
6. `DailyChallengeManager` のユニットテストがない
