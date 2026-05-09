# 要求内容: functional-design.md レビュー指摘事項の対応

## 背景

/review-docs による docs/functional-design.md の詳細レビュー結果に基づき、指摘された問題点を修正する。

## 対応内容

### [必須] 重大な問題

1. **ChallengeDataの型定義が欠落している**
   - `QuestStep.content`で`ChallengeData`が参照されているが、インターフェース定義が存在しない
   - PRDでP0必須のクエスト第3ステップのため、実装をブロックする

2. **DailyChallengeManagerがコンポーネント設計に未記載**
   - リポジトリ構造定義書にはファイルが列挙されているが、設計が存在しない

### [推奨] 改善推奨

3. **QuizUI/PuzzleUIのprops設計が未記載**
   - UIレイヤーの設計粒度がゲームロジックレイヤーと不統一

4. **ドキュメントのメタデータが欠如**
   - 他ドキュメントとの整合性追跡のために更新日を追加

5. **スコア計算方式がPRDに未記載**
   - 設計先行で要件が後付けになっている状態を注記で明示

6. **技術スタックセクションがarchitecture.mdと重複かつ不整合**
   - 機能設計書の技術スタック表を削除し、architecture.mdへの参照リンクに置き換え
   - glossary.mdのReactバージョン記述(18.x)を19.xに修正

## 対象ファイル

- `docs/functional-design.md` (主な修正対象)
- `docs/glossary.md` (Reactバージョン修正)
