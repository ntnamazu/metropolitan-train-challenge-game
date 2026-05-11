# 要求内容

## 概要

機能4（段階的難易度システム）の実装バグ5箇所を修正し、レベル2クエストのデータを追加することで、レベルアップが正しく機能するようにする。

## 背景

PRD確認で以下の問題が特定された：

### コードバグ（5箇所）
1. `ProgressManager.countCompletedQuestsByLevel` - 全クエストをレベル1としてカウントするバグ
2. `questStore.loadAvailableQuests` - 常に `getAvailableQuests(1)` を呼ぶ（プレイヤーの実際のレベルを無視）
3. `QuestManager.loadQuest/getAvailableQuests` - パスとクエストIDリストが level1 にハードコード
4. `QuizDataRepository.loadQuizzesByQuestId` - パスが `/data/quizzes/level1/` にハードコード
5. `PuzzleDataRepository.loadPuzzleByQuestId` - パスが `/data/puzzles/level1/` にハードコード

※ `RailwayDataRepository.loadRailwayMap` も sobu/tobu-kamedo のみハードコードで、新路線追加に対応していない

### データ不足
- `public/data/quests/level2/` 以降が存在しない
- レベル2の路線・クイズ・パズルデータが存在しない

## 実装対象の機能

### 1. 路線データの動的ロード
- `public/data/railways/index.json` をマニフェストとして導入
- `RailwayDataRepository` がマニフェストを読み込み全路線を動的にロード

### 2. クエスト管理のレベル対応
- `QuestManager` にレベル別クエストIDレジストリを持たせる
- `loadQuest` がレベルから正しいパスを組み立てる
- `getAvailableQuests(level)` が正しいレベルのクエストを返す

### 3. クイズ・パズルリポジトリのレベル対応
- `QuizDataRepository.loadQuizzesByQuestId` にレベルパラメータを追加
- `PuzzleDataRepository.loadPuzzleByQuestId` にレベルパラメータを追加

### 4. 進捗管理のレベル追跡修正
- `PlayerProgress` に `completedQuestsByLevel` フィールドを追加
- `ProgressManager.countCompletedQuestsByLevel` を修正（後方互換性あり）
- `progressStore.completeQuest` がクエストレベルを記録するよう修正

### 5. UI層のレベル対応
- `questStore.loadAvailableQuests` がプレイヤーの現在レベルを受け取る
- `QuestListScreen` が `progress.currentLevel` を渡す
- `DailyChallengeScreen` が `progress.currentLevel` を渡す
- `QuestPlayScreen` がクエストレベルを progressStore に渡す

### 6. レベル2データの追加
- 山手線（yamanote）の路線・クイズ・パズル・クエストデータを作成

## 受け入れ条件

### レベル対応ロード
- [ ] レベル2にアンロックされたプレイヤーはレベル2クエストが表示される
- [ ] レベル1プレイヤーにはレベル1クエストのみ表示される
- [ ] デイリーチャレンジもプレイヤーのレベルに対応したクエストを表示する

### レベルアップ判定
- [ ] レベル1クエストを3つクリアすると currentLevel が 2 になる
- [ ] `completedQuestsByLevel` にレベルごとのクエストIDが正しく記録される
- [ ] 既存データ（`completedQuestsByLevel` なし）の後方互換性が保たれる

### レベル2データ
- [ ] 山手線のクエスト `quest-yamanote-01` がプレイ可能
- [ ] クイズ（3問以上）とパズルが動作する

## スコープ外

以下はこのフェーズでは実装しません：
- レベル3・4のクエストデータ（コード基盤は整備済みとする）
- レベル2クエストを5個以上揃えること（最低1個でシステム動作確認）
- `quiz_streak` バッジ条件の実装

## 参照ドキュメント

- `docs/product-requirements.md` - 機能4の受け入れ条件
- `docs/architecture.md` - レイヤードアーキテクチャ
- `docs/functional-design.md` - データモデル定義
