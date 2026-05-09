# タスクリスト

## 実装タスク

- [x] `src/types/quest.ts` に `QuestStatus` 型エイリアスを追加
- [x] `src/types/quiz.ts` に `QuizStatus` 型エイリアスを追加
- [x] `src/types/puzzle.ts` に `PuzzleStatus` 型エイリアスを追加し、`PuzzleState.status` に適用
- [x] `src/types/common.ts` に `NetworkError` クラスを追加
- [x] `tests/unit/src/types/common.test.ts` に `NetworkError` ユニットテストを追加 (implementation-validator の推奨対応)

## 検証タスク

- [x] implementation-validator で品質検証 → 総合スコア 4.6/5、必須問題なし
- [x] `docker compose run --rm app npm test` が通ること → 22 passed / 0 failed
- [x] `docker compose run --rm app npm run lint` が通ること → 0 errors (既存の警告6件のみ)
- [x] `docker compose run --rm app npm run typecheck` が通ること → エラーなし

## 振り返り

- [x] tasklist.md に申し送り事項を記載

---

## 申し送り事項

### 実装完了日
2026-05-09

### 計画と実績の差分

**計画**: ドキュメント更新差分から型定義4件を追加

**実績**:
- 計画通り4件の型定義を追加
- implementation-validator の推奨に従い、`NetworkError` ユニットテストも追加（計画外）

### 学んだこと

- ドキュメントの「実装箇所」と実際のコードの配置が異なる場合がある（例: glossary では `src/utils/errors.ts` と記載されているが、`utils/` は将来追加予定のため `src/types/common.ts` に配置）
- ドキュメント更新差分の大部分はドキュメントが実装を正確に反映するための修正であり、実装変更は最小限（型追加4件のみ）
- `PuzzleState.status` のインライン型を `PuzzleStatus` 型エイリアスに置き換えても、TypeScript の型互換性のため既存コードへの破壊的変更は発生しない

### 次回への改善提案

1. **将来**: `QuestStatus` を `QuestSession.status` フィールドに適用してクエスト状態管理を型安全にする（現状 `questCompleted: boolean` フラグで管理）
2. **将来**: `QuizStatus`、`PuzzleStatus` を各コンポーネントや store の状態管理に統合する
3. **現在の既知の警告**: lint の `no-explicit-any` 警告6件は今回とは無関係の既存コードに存在する（`PlayerDataRepository.ts`、`BadgeSystem.ts`、テストファイル）
