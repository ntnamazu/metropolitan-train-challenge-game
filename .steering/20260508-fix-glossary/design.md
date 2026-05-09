# 実装アプローチ

## 変更ファイル

- `docs/glossary.md` のみ

## 変更内容の設計

### ドメイン用語セクションへの追加

**車両カード (Vehicle Card)**
- クエスト報酬として獲得できるコレクションアイテム
- レア度 (common / rare / legendary) を持つ
- データモデル: functional-design.md の Reward インターフェース参照

**QuestSession**
- QuestManager.startQuest() が返すセッションオブジェクト
- sessionId、questId、currentStepIndex、startedAt、results を持つ
- データモデル: functional-design.md の QuestSession インターフェース参照

**Reward(報酬)**
- クエストクリアで付与されるアイテムの共通型
- type: 'railway_line' | 'vehicle_card' | 'badge' | 'points'
- データモデル: src/types/quest.ts の Reward インターフェース参照

### ステータスセクションへの追加

**クイズステータス (Quiz Status)**
- answering / correct / incorrect の3状態
- 状態遷移図 (mermaid) を含む

### サービスクラスセクションへの追加

**DailyChallengeManager**
- functional-design.md のインターフェース定義をもとに記載
- 責務: 日付に基づくデイリークエスト提供、完了状態管理、ボーナスポイント付与
- メソッド: getDailyQuest / isCompleted / complete

### UIコンポーネントセクションの新設

**RailwayLinePhoto を移動**
- 「サービスクラス」セクションから独立した「UIコンポーネント」セクションを新設
- セクション見出しと内容の矛盾を解消

### リポジトリクラスセクションの新設

**RailwayDataRepository**
- functional-design.md のインターフェースをもとに記載
- 責務: 路線データの読み込み、駅・路線情報の提供

**PlayerDataRepository**
- functional-design.md のインターフェースをもとに記載
- 責務: ローカルストレージへの保存/読み込み

### エラーセクションへの追加

**NetworkError**
- development-guidelines.md の定義をもとに記載
- statusCode と cause を持つ拡張エラークラス

### データモデル参照先の修正

- 路線写真 (Railway Line Photo) の「データモデル」フィールドを
  `docs/functional-design.md` → `src/types/railway.ts` に修正

### 索引の修正

- 「駅」: さ行 → え行に移動
- 「難易度レベル」: た行 → な行に移動
- 新規追加用語を適切な行に追加:
  - あ行: なし
  - か行: 「クイズステータス」
  - さ行: 「サービスクラス」のままで良い
  - た行: 「デイリーチャレンジ」はそのまま、「難易度レベル」を削除
  - な行を新設: 「難易度レベル」
  - は行: 「報酬」「バッジ」等
  - え行を新設: 「駅」
  - A-Z: DailyChallengeManager、NetworkError、PlayerDataRepository、QuestSession、RailwayDataRepository、Reward を追加

## 実装の順序

1. 更新日の変更
2. ドメイン用語の追加（車両カード、QuestSession、Reward）
3. ステータスの追加（クイズステータス）
4. サービスクラスの追加（DailyChallengeManager）
5. UIコンポーネントセクションの新設（RailwayLinePhotoの移動）
6. リポジトリクラスセクションの新設
7. エラーの追加（NetworkError）
8. データモデル参照先の修正
9. 索引の修正・更新
