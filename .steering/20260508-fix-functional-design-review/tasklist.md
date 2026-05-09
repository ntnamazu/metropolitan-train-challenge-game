# タスクリスト

## フェーズ1: functional-design.md の修正

- [x] ドキュメントメタデータ（更新日）を追加
- [x] 技術スタックセクションをarchitecture.mdへの参照に置き換え
- [x] ChallengeData インターフェースを追加
- [x] DailyChallengeManager インターフェースを追加
- [x] QuizUI/PuzzleUI の props インターフェースを追記
- [x] スコア計算方式がPRD未記載であることの注記を追加

## フェーズ2: glossary.md の修正

- [x] Reactバージョン記述を 18.x → 19.x に修正

## 実装後の振り返り

**実装完了日**: 2026-05-08

**計画と実績の差分**:
- 計画通りすべてのタスクを完了

**学んだこと**:
- functional-design.md は詳細な型定義を持つが、一部の型(ChallengeData)や一部のサービス(DailyChallengeManager)が他ドキュメントと整合していなかった
- 複数ドキュメント間のバージョン情報は一箇所(architecture.md)に集約し、他からは参照する設計が有効

**次回への改善提案**:
- ドキュメント間の整合性チェックを定期的に実施する(特に型定義と実装ファイルリストの突合)
