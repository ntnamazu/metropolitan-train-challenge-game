# 実装アプローチ

## ChallengeData インターフェース

QuestStepの`content`型として参照されている`ChallengeData`を定義する。
チャレンジはクエストの第3ステップであり、タイムアタック・ノーミス・コンボの3種類を想定。

```typescript
interface ChallengeData {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  timeLimit: number;          // 制限時間 (秒)
  steps: (QuizQuestion | PuzzleData)[]; // チャレンジ内のステップ
  requiredScore?: number;     // クリアに必要なスコア
}

type ChallengeType =
  | 'time_attack'   // タイムアタック
  | 'no_miss'       // ノーミスチャレンジ
  | 'combo';        // コンボチャレンジ
```

挿入位置: PuzzleDataエンティティの直後（データモデル定義セクション内）

## DailyChallengeManager インターフェース

ゲームロジックレイヤーのBadgeSystemの後に追加。
シーケンス図（ユースケース2）で`getDailyQuest(date)`が呼ばれており、それを踏まえて定義。

```typescript
class DailyChallengeManager {
  getDailyQuest(date: string): Quest;
  isCompleted(date: string): boolean;
  complete(date: string, bonusPoints: number): DailyChallengeProgress;
}
```

## QuizUI/PuzzleUI props インターフェース

既存の「Quiz/PuzzleUI: ゲーム画面UI」セクションに追記する形で、propsインターフェースを追加。

## メタデータ

ドキュメント冒頭の`# 機能設計書`直後に更新日を追加。

## スコア計算注記

`calculatePuzzleScore`関数の定義箇所に、PRD未記載の設計判断であることを明記する注記を追加。

## 技術スタック置き換え

現在の技術スタック表テーブル(7行)を削除し、architecture.mdへの参照リンクに置き換える。
