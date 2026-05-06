# 設計書

## 問題の根本原因

`PuzzleDataRepository.loadPuzzleByQuestId` が `RailwayDataRepository.loadRailwayMap()` で全路線統合マップを取得し、そのままパズルデータに設定している。

`sobu.json` と `tobu-kamedo.json` はそれぞれ独立した座標系を持ち、どちらも x=0, x=50 から始まる。統合後に SVG に描画すると、異なる駅が同一ピクセル位置に重なる。

## 修正方針

`PuzzleDataRepository.loadPuzzleByQuestId` の中で、パズルの `startStation` / `goalStation` が属する路線IDを特定し、それらの路線に関係する駅・接続・路線のみに railwayMap をフィルタリングする。

## コンポーネント設計

### PuzzleDataRepository の修正

**責務**:
- パズルに必要な路線データのみを提供する

**実装の要点**:

```typescript
const startStation = railwayMap.stations.find(s => s.id === puzzleData.startStation);
const goalStation = railwayMap.stations.find(s => s.id === puzzleData.goalStation);

const relevantLineIds = new Set([
  ...(startStation?.lines ?? []),
  ...(goalStation?.lines ?? []),
]);

puzzleData.railwayMap = {
  stations: railwayMap.stations.filter(s => s.lines.some(l => relevantLineIds.has(l))),
  lines: railwayMap.lines.filter(l => relevantLineIds.has(l.id)),
  connections: railwayMap.connections.filter(c => relevantLineIds.has(c.lineId)),
};
```

## データフロー

### パズルデータ読み込み

```
1. クエストIDからパズルJSONを fetch
2. 全路線統合マップを loadRailwayMap() で取得
3. puzzleData.startStation / goalStation が属する lineIds を抽出
4. 抽出した lineIds に属する stations / lines / connections のみにフィルタ
5. フィルタ済みの railwayMap を puzzleData に設定して返す
```

## 変更ファイル

```
src/repositories/PuzzleDataRepository.ts  ← 修正のみ（1ファイル）
```

## 実装の順序

1. `PuzzleDataRepository.ts` を修正してフィルタリングロジックを追加
2. テスト・lint・typecheck を実行して確認
