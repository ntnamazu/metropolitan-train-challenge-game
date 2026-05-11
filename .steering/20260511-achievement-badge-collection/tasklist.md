# タスクリスト

## 🚨 タスク完全完了の原則

**このファイルの全タスクが完了するまで作業を継続すること**

### 必須ルール
- **全てのタスクを`[x]`にすること**
- 「時間の都合により別タスクとして実施予定」は禁止
- 「実装が複雑すぎるため後回し」は禁止
- 未完了タスク（`[ ]`）を残したまま作業を終了しない

---

## フェーズ1: 型定義とデータ整備

- [x] `src/types/player.ts` に `VehicleCard` 型を追加
  - [x] `VehicleCard` インターフェースを定義 (id, name, description, rarity, lineId, imageUrl?)
- [x] `public/data/badges.json` を拡充
  - [x] 既存バッジ「総武線マスター」を `complete_line` 条件に更新 (requirement: string[])
  - [x] 「東武亀戸線制覇」バッジを追加 (complete_quest: quest-tobu-kamedo-01)
  - [x] 「クイズ名人」バッジを追加 (total_correct_quizzes: 5)
  - [x] 「コレクター」バッジを追加 (quest_count: 3)
  - [x] 「継続は力なり」バッジを追加 (play_days: 3)
- [x] `public/data/vehicles.json` を新規作成
  - [x] E233系 0番台 (common, line-sobu)
  - [x] 8000系 (common, line-tobu-kamedo)
  - [x] E235系 (rare, line-yamanote) ← 将来のクエスト用
- [x] クエストデータに vehicle_card 報酬を追加
  - [x] `quest-sobu-01.json` に E233系 0番台を追加
  - [x] `quest-tobu-kamedo-01.json` に 8000系を追加

## フェーズ2: サービス層の実装

- [x] `src/services/BadgeSystem.ts` を拡充
  - [x] BadgeCondition の type を拡張 (`total_correct_quizzes`, `quest_count` を追加)
  - [x] `complete_line` 条件の実装 (requirement: string[] で全クエストIDが完了済みかチェック)
  - [x] `total_correct_quizzes` 条件の実装 (statistics.correctQuizzes >= requirement)
  - [x] `quest_count` 条件の実装 (completedQuestIds.length >= requirement)
  - [x] `getConditionDescription(condition)` メソッドを追加 (UI表示用の説明文生成)
  - [x] `getAllBadgeDefinitions()` メソッドを追加 (全バッジ定義を返す)
- [x] `src/repositories/VehicleCardRepository.ts` を新規作成
  - [x] `loadVehicleCards(): Promise<VehicleCard[]>` を実装
  - [x] `getVehicleCardById(id): Promise<VehicleCard | undefined>` を実装

## フェーズ3: インフラ層の更新

- [x] `src/services/instances.ts` に `vehicleCardRepository` を追加
- [x] `src/types/index.ts` で `VehicleCard` をエクスポート確認 (player.ts の `export *` で自動含まれる)

## フェーズ4: UI層の実装

- [x] `src/components/screens/CollectionScreen.tsx` を拡充
  - [x] 全バッジ定義を読み込む useEffect を追加 (loadBadgeDefinitions)
  - [x] 全車両カードを読み込む useEffect を追加 (loadVehicleCards)
  - [x] バッジセクション: 獲得済みバッジを黄色カードで表示
  - [x] バッジセクション: 未獲得バッジをグレーカードで条件説明付きで表示
  - [x] 車両カードセクション: レア度別 (Legendary/Rare/Common) に分類して表示
  - [x] 車両カード: アンロック済みはフルカラー、未アンロックはグレースケール + 「???」

## フェーズ5: テスト実装

- [x] `tests/unit/src/services/BadgeSystem.test.ts` を新規作成
  - [x] `complete_line`: 全クエストID完了時に true を返す
  - [x] `complete_line`: 一部未完了時に false を返す
  - [x] `complete_line`: 既に獲得済みバッジはスキップされる
  - [x] `total_correct_quizzes`: 正解数が条件以上で true を返す
  - [x] `total_correct_quizzes`: 正解数が条件未満で false を返す
  - [x] `quest_count`: クエスト数が条件以上で true を返す
  - [x] `quest_count`: クエスト数が条件未満で false を返す

## フェーズ6: 品質チェックと修正

- [x] すべてのテストが通ることを確認
  - [x] `npm test` (50 tests passed)
- [x] リントエラーがないことを確認
  - [x] `npm run lint` (0 errors, 6 warnings - 既存と同水準)
- [x] 型エラーがないことを確認
  - [x] `npm run typecheck`
- [x] ビルドが成功することを確認
  - [x] `npm run build`

## フェーズ7: ドキュメント更新

- [x] 実装後の振り返り（このファイルの下部に記録）

---

## 実装後の振り返り

### 実装完了日
2026-05-11

### 計画と実績の差分

**計画と異なった点**:
- `BadgeSystem` のテスタビリティ改善のため、コンストラクタにオプショナルの `initialDefinitions` 引数を追加。これにより `any` キャストなしでモックインジェクション可能になった
- バリデーション結果を受けて `VehicleCardRepository.test.ts` を追加 (計画外)
- `CollectionScreen.tsx` の `useEffect` に `.catch()` エラーハンドリングを追加 (計画外)

**新たに必要になったタスク**:
- `VehicleCardRepository.test.ts` の作成: 既存リポジトリのテストカバレッジ基準に合わせるため追加
- `BadgeSystem` コンストラクタ引数対応: テスタビリティ改善のため追加

**技術的理由でスキップしたタスク**（該当する場合のみ）:
- なし

### 学んだこと

**技術的な学び**:
- `BadgeSystem.checkBadgeConditions` の `complete_line` 条件では `requirement` を `string[]` にすることで、路線IDとクエストIDのマッピングをバッジ定義側で管理でき、BadgeSystem が QuestManager に依存しないシンプルな設計を維持できた
- コンストラクタインジェクションによる初期値注入パターンは `any` キャストを不要にするテスタビリティ改善の常套手段

**プロセス上の改善点**:
- implementation-validator サブエージェントが useEffect のエラーハンドリング欠如を検出してくれた。UI コンポーネントで非同期データ取得をする際は `.catch()` の追加を忘れないよう意識する

### 次回への改善提案
- `quiz_streak` (連続正解数) 条件を実装する場合は `PlayerStatistics` に `currentQuizStreak` フィールドを追加し、QuizEngine がクイズ正解/不正解時に更新する処理が必要
- アーキテクチャ規約として UIレイヤーからデータレイヤーへの直接アクセスが発生している (vehicleCardRepository)。将来的に progressStore を通じたアクセスパターンに統一することを検討する
