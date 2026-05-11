# 設計書

## 問題分析

`src/components/common/RailwayLinePhoto.tsx` の img 要素に以下のクラスが設定されている:

```
className="w-full h-40 object-cover rounded-lg"
```

- `h-40`: 固定高さ160pxを強制
- `object-cover`: 固定高さに合わせて画像をクロップ（上下が切れる）

## 修正方針

`h-40` と `object-cover` を削除し、画像を自然なアスペクト比で表示する。

```
修正前: className="w-full h-40 object-cover rounded-lg"
修正後: className="w-full rounded-lg"
```

### 選択理由

- `w-full`: 横幅コンテナいっぱいに表示（維持）
- 高さ指定なし: 画像の縦横比に応じて自動で高さが決まる
- `rounded-lg`: 角丸スタイルを維持

## コンポーネント設計

### RailwayLinePhoto

**変更内容**:
- img の className から `h-40` と `object-cover` を削除

**影響範囲**:
- `src/components/quiz/QuizContainer.tsx` — クイズ中の路線写真表示
- `src/components/screens/QuestPlayScreen.tsx` — クエストクリア報酬モーダルの路線写真表示

## 実装の順序

1. `RailwayLinePhoto.tsx` の img クラスを修正

## テスト戦略

- 型チェック・リントの確認
- ビジュアル確認（実際の画像表示で上下が切れないこと）
