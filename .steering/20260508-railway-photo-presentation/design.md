# 設計: 機能7: 路線写真演出

## 変更ファイル一覧

### 型定義
- `src/types/railway.ts`: `RailwayPhoto` インターフェース追加、`RailwayLine` に写真フィールド追加

### 新規コンポーネント
- `src/components/common/RailwayLinePhoto.tsx`: 写真 + 帰属表示コンポーネント

### 既存コンポーネント修正
- `src/components/quiz/QuizContainer.tsx`: `railwayLine` props 追加、写真表示
- `src/components/screens/QuestPlayScreen.tsx`: 路線データ読み込み、写真演出 (アンロック)

### データ
- `public/data/railways/jr/sobu.json`: `quizPhotos`, `feedbackPhotos`, `unlockPhoto` 追加
- `public/data/railways/private/tobu-kamedo.json`: 同上

### テスト
- `tests/unit/src/components/common/RailwayLinePhoto.test.tsx`: 帰属表示のテスト

## 設計方針

### RailwayPhoto 型
```typescript
interface RailwayPhoto {
  imageUrl: string;
  photographer: string;
  license: 'CC0' | 'CC BY' | 'CC BY-SA';
  licenseVersion?: string;
  commonsPageUrl: string;
}
```

### RailwayLine への追加フィールド
```typescript
interface RailwayLine {
  // ...既存フィールド
  quizPhotos: RailwayPhoto[];
  feedbackPhotos: RailwayPhoto[];
  unlockPhoto?: RailwayPhoto;
}
```

### RailwayLinePhoto コンポーネント
- props: `{ photo: RailwayPhoto }`
- 帰属表示フォーマット: `📷 {photographer} / Wikimedia Commons / {license} {licenseVersion}`
- 写真の外側 (下) に小さなグレーテキストで表示

### QuizContainer の写真表示ロジック
- `railwayLine?: RailwayLine` を props に追加 (任意)
- 問題表示時: `quizPhotos` からランダムに1枚選択 (問題変わるたびに再選択)
- フィードバック表示時:
  - `feedbackPhotos` が空でなければそちらから選択
  - 空なら `quizPhotos` から引き続き表示 (同じ写真を維持)

### QuestPlayScreen の変更
- クエスト開始時に `railwayRepo.getLineById(quest.railwayLine)` で路線データ読み込み
- `QuizContainer` に `railwayLine` を渡す
- `RewardModal` を拡張: `railway_line` 報酬がある場合に `unlockPhoto` を表示
  - 路線データが読み込み済みであれば、その `unlockPhoto` を使用
