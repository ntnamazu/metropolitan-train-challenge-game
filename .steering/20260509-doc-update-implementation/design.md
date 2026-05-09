# 実装アプローチ

## 変更方針

ドキュメント更新差分と現行実装を照合した結果、必要な実装変更は型定義の追加のみ。
ビジネスロジックやコンポーネントへの変更は不要。

## 変更ファイル

### src/types/quest.ts
`QuestStatus` 型エイリアスを追加し export する。

```typescript
export type QuestStatus = 'in_progress' | 'completed' | 'failed';
```

### src/types/quiz.ts
`QuizStatus` 型エイリアスを追加し export する。

```typescript
export type QuizStatus = 'answering' | 'correct' | 'incorrect';
```

### src/types/puzzle.ts
`PuzzleStatus` 型エイリアスを追加し export する。
`PuzzleState.status` フィールドのインライン型を `PuzzleStatus` に置き換える。

```typescript
export type PuzzleStatus = 'in_progress' | 'completed' | 'failed';

export interface PuzzleState {
  ...
  status: PuzzleStatus;  // インライン型から名前付き型に変更
}
```

### src/types/common.ts
`NetworkError` クラスを追加する（開発ガイドライン記載の実装に準拠）。

```typescript
export class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public cause?: Error
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}
```

## 影響範囲

- `src/types/index.ts` は `export * from './quest'` 等でまとめて re-export しているため変更不要
- 既存コードへの破壊的変更なし（PuzzleState.status の型互換性は保たれる）
- テストへの影響なし（型エイリアスの追加は既存テストを壊さない）
