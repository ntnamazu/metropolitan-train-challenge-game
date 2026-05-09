# 要求内容

## 背景

以下の5つのドキュメントが更新された。更新差分を読み取り、現状の実装との乖離点を特定し、実装に反映する。
未実装の将来機能（「将来追加予定」と明記されているもの）はスコープ外。

対象ドキュメント:
1. `docs/functional-design.md`
2. `docs/architecture.md`
3. `docs/repository-structure.md`
4. `docs/development-guidelines.md`
5. `docs/glossary.md`

## 調査結果: 実装との乖離点

### 実装済みで問題なし（差分なし）

- `RailwayLine` の `quizPhotos`, `feedbackPhotos`, `unlockPhoto` フィールド → 既にある
- `RailwayPhoto` インターフェース → 既にある
- `RailwayLinePhoto` コンポーネント（帰属表示付き）→ 既にある
- `services/instances.ts` → 既にある
- `feedbackPhotos` / `quizPhotos` の切り替えロジック → `QuizContainer.tsx` に実装済み
- `vitest.config.ts` の `thresholds` キー → 既に `thresholds` を使用（正しい）
- Zustand storeの3種類 (questStore, progressStore, uiStore) → 既にある
- バックアップ戦略 (`PlayerDataRepository`) → 既にある

### 乖離あり → 実装が必要なもの

1. **`QuestStatus` 型エイリアス** が `src/types/quest.ts` に未定義
   - `type QuestStatus = 'in_progress' | 'completed' | 'failed'`
   - 用語集の「実装箇所: `src/types/quest.ts`」に記載

2. **`QuizStatus` 型エイリアス** が `src/types/quiz.ts` に未定義
   - `type QuizStatus = 'answering' | 'correct' | 'incorrect'`
   - 用語集の「実装箇所: `src/types/quiz.ts`」に記載

3. **`PuzzleStatus` 型エイリアス** が `src/types/puzzle.ts` に未定義
   - `type PuzzleStatus = 'in_progress' | 'completed' | 'failed'`
   - `PuzzleState.status` はインライン型で定義されているが、名前付き型として export すべき
   - 用語集の「実装箇所: `src/types/puzzle.ts`」に記載

4. **`NetworkError` クラス** が未実装
   - 開発ガイドラインに実装例が記載（`message`, `statusCode?`, `cause?`）
   - 用語集の「実装箇所: `src/utils/errors.ts`」だが、`utils/` は将来追加予定のため、既存の `src/types/common.ts` に追加する

### スコープ外（将来追加予定）

- `src/hooks/`, `src/utils/` ディレクトリ
- 統合テスト
- Modal, Timer, LoadingSpinner コンポーネント
- `NetworkError` の `src/utils/errors.ts` への移動（utils/ が将来追加予定のため）
