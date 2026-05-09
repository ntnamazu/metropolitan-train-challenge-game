# 要求内容

## 概要

`docs/glossary.md` のレビュー結果に基づき、不足用語の追加・不整合の修正・索引の修正を行う。

## 背景

doc-reviewerサブエージェントによるレビューで、以下の問題が指摘された:
- 重要なサービスクラス・ドメイン用語が欠落している
- セクション分類の不整合がある
- 索引の誤分類がある

## 実装対象の機能

### 1. 欠落用語の追加
- DailyChallengeManager をサービスクラスセクションに追加
- 車両カード (Vehicle Card) をドメイン用語セクションに追加
- クイズステータス (Quiz Status) をステータスセクションに追加
- リポジトリクラスセクションを新設 (RailwayDataRepository, PlayerDataRepository)
- NetworkError をエラーセクションに追加
- QuestSession をドメイン用語セクションに追加
- Reward(報酬) をドメイン用語セクションに追加

### 2. 不整合の修正
- RailwayLinePhoto を「UIコンポーネント」セクションとして分離
- RailwayPhoto のデータモデル参照先を `src/types/railway.ts` に修正

### 3. 索引の修正
- 「駅」の分類をさ行からえ行に移動
- 「難易度レベル」の分類をた行からな行に移動
- 新規追加用語を索引に追加

### 4. 更新日の更新
- 更新日を2026-05-08に変更

## 受け入れ条件

- [ ] DailyChallengeManager がサービスクラスセクションに定義されている
- [ ] 車両カード がドメイン用語セクションに定義されている
- [ ] クイズステータス がステータスセクションに定義されている
- [ ] リポジトリクラスセクションが新設され、主要リポジトリが定義されている
- [ ] NetworkError がエラーセクションに定義されている
- [ ] RailwayLinePhoto が専用セクション(UIコンポーネント)に移動されている
- [ ] RailwayPhoto のデータモデル参照先が src/types/railway.ts に修正されている
- [ ] 索引の誤分類が修正されている
- [ ] 全追加用語が索引に反映されている

## スコープ外

- ソースコードの変更
- 他のドキュメントの変更

## 参照ドキュメント

- `docs/glossary.md` - 修正対象
- `docs/functional-design.md` - DailyChallengeManager、QuestSession等の定義元
- `docs/development-guidelines.md` - NetworkError の定義元
