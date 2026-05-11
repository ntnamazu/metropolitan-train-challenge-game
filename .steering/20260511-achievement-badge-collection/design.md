# 設計書

## アーキテクチャ概要

既存のレイヤードアーキテクチャを踏襲する:

```
UIレイヤー (CollectionScreen)
    ↓
ゲームロジックレイヤー (BadgeSystem)
    ↓
データレイヤー (VehicleCardRepository, badges.json, vehicles.json)
```

## コンポーネント設計

### 1. VehicleCard 型定義 (`src/types/player.ts`)

**責務**:
- 車両カードのデータ構造を定義

**新しい型**:
```typescript
export interface VehicleCard {
  id: string;           // 例: "vehicle-e233"
  name: string;         // 例: "E233系"
  description: string;  // 例: "中央・総武線各駅停車で活躍する通勤電車"
  rarity: 'common' | 'rare' | 'legendary';
  lineId: string;       // 所属路線ID
}
```

### 2. BadgeDefinition の条件型拡張 (`src/services/BadgeSystem.ts`)

**拡張する条件タイプ**:
```typescript
interface BadgeCondition {
  type: 'complete_quest' | 'complete_line' | 'quiz_streak' | 'play_days'
      | 'total_correct_quizzes' | 'quest_count';
  requirement: string | string[] | number;
}
```

**各条件の実装**:
- `complete_line`: `requirement` は `string[]` (必要なクエストIDリスト)、全IDがcompletedQuestIdsに含まれているか確認
- `total_correct_quizzes`: `requirement` は `number`、`statistics.correctQuizzes >= requirement` を確認
- `quest_count`: `requirement` は `number`、`completedQuestIds.length >= requirement` を確認
- `play_days`: 既存実装 (`statistics.consecutiveDays >= requirement`)

### 3. VehicleCardRepository (`src/repositories/VehicleCardRepository.ts`)

**責務**:
- `/data/vehicles.json` からデータ読み込み
- VehicleCard[] を提供

**インターフェース**:
```typescript
class VehicleCardRepository {
  async loadVehicleCards(): Promise<VehicleCard[]>;
  async getVehicleCardById(id: string): Promise<VehicleCard | undefined>;
}
```

### 4. CollectionScreen 拡充 (`src/components/screens/CollectionScreen.tsx`)

**新しいセクション**:
1. **バッジセクション**:
   - 獲得済みバッジ: 黄色カード + バッジ名 + 説明
   - 未獲得バッジ: グレーカード + バッジ名 + 「条件: {条件説明}」
2. **車両カードセクション**:
   - レア度タブ or レア度バッジでフィルタリング
   - Legendary(金枠) > Rare(青枠) > Common(白枠)
   - アンロック済み: フルカラー表示
   - 未アンロック: グレースケール + 「???」表示

**バッジ条件の説明文生成**:
`BadgeSystem` に `getConditionDescription(condition: BadgeCondition): string` を追加:
- `complete_line`: "指定された路線のクエストをすべてクリア"
- `play_days`: "N日間連続でプレイ"
- `total_correct_quizzes`: "クイズにN問正解"
- `quest_count`: "クエストをN個クリア"

## データフロー

### バッジ獲得フロー
```
1. progressStore.completeQuest(questId, rewards) が呼ばれる
2. badgeSystem.checkBadgeConditions(updatedProgress) で新規バッジ判定
3. 新しいバッジが発見されれば progressManager.earnBadge() で記録
4. progress が更新されて CollectionScreen に反映
```

### コレクション画面表示フロー
```
1. CollectionScreen マウント時
2. badgeSystem.loadBadgeDefinitions() で全バッジ定義を取得
3. vehicleCardRepo.loadVehicleCards() で全車両カード取得
4. progressStore から progress (獲得済みバッジID, unlockedVehicleIds) を取得
5. 差分を計算して 獲得済み/未獲得 を分類
6. UI に反映
```

## エラーハンドリング戦略

- データファイル読み込み失敗: グレースケール表示のフォールバック (既存の NotFoundError パターンを踏襲)
- 空のリスト: 「まだ獲得していません」プレースホルダーを表示

## テスト戦略

### ユニットテスト (`tests/unit/src/services/BadgeSystem.test.ts`)
- `complete_line`: 全クエスト完了時に true を返す
- `complete_line`: 一部未完了時に false を返す
- `total_correct_quizzes`: 正解数が条件以上で true を返す
- `quest_count`: クエスト数が条件以上で true を返す
- `play_days`: 連続プレイ日数が条件以上で true を返す (既存テストを参考)

## 依存ライブラリ

新しいライブラリは追加しない。既存スタックで実装。

## ディレクトリ構造

```
src/
  types/
    player.ts          ← VehicleCard 型を追加
  services/
    BadgeSystem.ts     ← 条件判定を拡張
  repositories/
    VehicleCardRepository.ts  ← 新規作成
  components/screens/
    CollectionScreen.tsx       ← 大幅拡充

public/data/
  badges.json          ← バッジを追加・修正
  vehicles.json        ← 新規作成

tests/unit/src/services/
  BadgeSystem.test.ts  ← 新規作成
```

## 実装の順序

1. VehicleCard 型定義追加 (player.ts)
2. badges.json を拡充 (complete_line 条件に対応)
3. vehicles.json を新規作成
4. BadgeSystem の条件判定を実装
5. VehicleCardRepository を新規作成
6. instances.ts にVehicleCardRepository を追加
7. クエストデータ (quest-sobu-01, quest-tobu-kamedo-01) に vehicle_card 報酬を追加
8. CollectionScreen を拡充
9. BadgeSystem のユニットテストを実装

## セキュリティ考慮事項

- ローカルストレージのみ使用、外部通信なし。既存パターンと同じ。

## パフォーマンス考慮事項

- `loadBadgeDefinitions()` と `loadVehicleCards()` は CollectionScreen マウント時に一度だけ呼び出す (useEffect)

## 将来の拡張性

- `VehicleCard.imageUrl` フィールドを型に含めておくことで、将来の画像追加に対応
- バッジ条件タイプを Union type で定義しているため、新条件を追加しやすい
