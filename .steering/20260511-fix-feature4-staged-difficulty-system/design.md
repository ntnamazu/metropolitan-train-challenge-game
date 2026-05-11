# 設計書

## アーキテクチャ概要

既存のレイヤードアーキテクチャ（UI → ゲームロジック → データ）を維持しつつ、各レイヤーのハードコード部分をレベル対応に修正する。

```
変更ファイル一覧:
src/types/player.ts                          ← PlayerProgress 型拡張
src/services/QuestManager.ts                 ← レベル別クエストIDレジストリ追加
src/repositories/QuizDataRepository.ts       ← level パラメータ追加
src/repositories/PuzzleDataRepository.ts     ← level パラメータ追加
src/repositories/RailwayDataRepository.ts    ← 動的路線ロード
src/services/ProgressManager.ts              ← countCompletedQuestsByLevel 修正
src/stores/progressStore.ts                  ← completeQuest に questLevel 追加
src/stores/questStore.ts                     ← loadAvailableQuests にレベル追加
src/components/screens/QuestPlayScreen.tsx   ← level を progressStore/リポジトリに渡す
src/components/screens/QuestListScreen.tsx   ← progress.currentLevel を渡す
src/components/screens/DailyChallengeScreen.tsx ← progress.currentLevel を渡す

public/data/railways/index.json              ← 路線マニフェスト
public/data/railways/jr/yamanote.json        ← 山手線データ
public/data/quizzes/level2/yamanote-quiz.json
public/data/puzzles/level2/yamanote-puzzle-01.json
public/data/quests/level2/quest-yamanote-01.json
```

## コンポーネント設計

### 1. PlayerProgress 型拡張

**責務**: レベル別クエスト完了数を追跡する

```typescript
// src/types/player.ts に追加
interface PlayerProgress {
  // ... 既存フィールド ...
  completedQuestsByLevel?: Record<number, string[]>; // 後方互換のため optional
}
```

**設計の要点**:
- `optional` にすることで既存のローカルストレージデータとの後方互換性を確保
- `createInitialProgress` では `{}` で初期化

### 2. QuestManager レベル対応

**責務**: レベル別クエストIDを管理し、正しいパスからクエストをロード

**実装の要点**:
```typescript
private readonly levelQuestIds: Record<number, string[]> = {
  1: ['quest-sobu-01', 'quest-sobu-02', 'quest-tobu-kamedo-01'],
  2: ['quest-yamanote-01'],
  3: [],
  4: [],
};

private findQuestLevel(questId: string): number | null {
  for (const [level, ids] of Object.entries(this.levelQuestIds)) {
    if (ids.includes(questId)) return parseInt(level);
  }
  return null;
}

async loadQuest(questId: string): Promise<Quest> {
  const level = this.findQuestLevel(questId);
  // パスを level${level}/ で組み立て
}

async getAvailableQuests(level: DifficultyLevel): Promise<Quest[]> {
  const questIds = this.levelQuestIds[level] ?? [];
  // questIds から Quest[] を生成
}
```

### 3. QuizDataRepository / PuzzleDataRepository level パラメータ

```typescript
// 前: loadQuizzesByQuestId(questId: string)
// 後: loadQuizzesByQuestId(questId: string, level: DifficultyLevel = 1)

async loadQuizzesByQuestId(questId: string, level: DifficultyLevel = 1) {
  const lineName = questId.match(/quest-(.+)-\d+/)?.[1];
  const response = await fetch(`/data/quizzes/level${level}/${lineName}-quiz.json`);
}
```

**設計の要点**:
- デフォルト値 `= 1` で既存の呼び出しとの後方互換性を確保

### 4. RailwayDataRepository 動的ロード

**責務**: index.json マニフェストを読み込み、全路線データを統合

```typescript
// public/data/railways/index.json
{ "files": ["jr/sobu.json", "jr/yamanote.json", "private/tobu-kamedo.json"] }

async loadRailwayMap(): Promise<RailwayMap> {
  const index = await fetch('/data/railways/index.json').then(r => r.json());
  const allMaps = await Promise.all(
    index.files.map(f => fetch(`/data/railways/${f}`).then(r => r.json()))
  );
  // merge into single RailwayMap
}
```

### 5. ProgressManager 修正

**責務**: completedQuestsByLevel を使用してレベルアップを正確に判定、後方互換を維持

```typescript
private countCompletedQuestsByLevel(progress: PlayerProgress): Record<number, number> {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  const byLevel = progress.completedQuestsByLevel;

  if (byLevel && Object.keys(byLevel).length > 0) {
    // 新データ構造: レベル別集計を使用
    for (const [level, ids] of Object.entries(byLevel)) {
      counts[parseInt(level)] = ids.length;
    }
  } else {
    // 後方互換: completedQuestsByLevel 未設定の場合は全クエストをレベル1とみなす
    counts[1] = progress.completedQuestIds.length;
  }

  return counts;
}
```

### 6. progressStore.completeQuest シグネチャ変更

```typescript
// 前: completeQuest: (questId: string, rewards: Reward[]) => void
// 後: completeQuest: (questId: string, questLevel: DifficultyLevel, rewards: Reward[]) => void

completeQuest: (questId, questLevel, rewards) => {
  // completedQuestsByLevel にも記録
  const byLevel = { ...(updated.completedQuestsByLevel ?? {}) };
  const levelIds = byLevel[questLevel] ?? [];
  if (!levelIds.includes(questId)) {
    byLevel[questLevel] = [...levelIds, questId];
  }
  updated.completedQuestsByLevel = byLevel;
  // ...残りは既存ロジック
}
```

### 7. questStore.loadAvailableQuests レベル対応

```typescript
// 前: loadAvailableQuests: () => Promise<void>
// 後: loadAvailableQuests: (level?: DifficultyLevel) => Promise<void>

loadAvailableQuests: async (level = 1) => {
  const quests = await questManager.getAvailableQuests(level);
  set({ availableQuests: quests, isLoadingQuests: false });
}
```

## データフロー

### クエスト完了 → レベルアップ
```
1. QuestPlayScreen: handleChallengeComplete()
2. progressStore.completeQuest(questId, quest.level, rewards) 呼び出し
3. completedQuestsByLevel[level].push(questId)
4. progressManager.checkLevelUp(updated) 呼び出し
5. countCompletedQuestsByLevel が completedQuestsByLevel を参照
6. 条件達成なら currentLevel を更新
7. localStorage に保存
```

### レベル別クエストロード
```
1. QuestListScreen: progress.currentLevel を取得
2. loadAvailableQuests(currentLevel) を呼び出し
3. questManager.getAvailableQuests(level)
4. levelQuestIds[level] からIDリスト取得
5. 各IDで findQuestLevel → 正しい level${n}/ パスでJSONロード
6. availableQuests に格納
```

## テスト戦略

### ユニットテスト（更新・追加）
- `ProgressManager.test.ts`:
  - 既存テスト（後方互換確認): completedQuestsByLevel なしで正常動作
  - 新規テスト: completedQuestsByLevel ありでレベルアップ判定
  - 新規テスト: レベル2クエストをレベル1クリア数としてカウントしない

## ディレクトリ構造（変更分のみ）

```
public/data/
├── railways/
│   ├── index.json                    ← NEW
│   ├── jr/
│   │   └── yamanote.json             ← NEW
│   └── private/
│       └── (既存)
├── quests/
│   └── level2/
│       └── quest-yamanote-01.json    ← NEW
├── quizzes/
│   └── level2/
│       └── yamanote-quiz.json        ← NEW
└── puzzles/
    └── level2/
        └── yamanote-puzzle-01.json   ← NEW
```

## 実装の順序

1. 型定義変更（player.ts）
2. データファイル作成（JSON）
3. RailwayDataRepository 修正
4. QuestManager 修正
5. QuizDataRepository / PuzzleDataRepository 修正
6. ProgressManager 修正
7. progressStore 修正
8. questStore 修正
9. UI コンポーネント修正（QuestPlayScreen, QuestListScreen, DailyChallengeScreen）
10. テスト更新・追加

## セキュリティ考慮事項

- 変更なし（既存と同じローカルストレージ + 静的ファイルアクセス）

## パフォーマンス考慮事項

- `RailwayDataRepository` で全路線を一括ロードするが、キャッシュ（`railwayMapCache`）が維持される
- `index.json` の追加ネットワークリクエストは1回のみ（キャッシュされる）
- Promise.all による並列フェッチで路線ロード時間を最小化
