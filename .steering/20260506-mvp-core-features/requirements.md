# 要求内容

## 概要

前回（20260505）の実装でTypeScriptコアロジック（型定義・リポジトリ・サービス）は完成済み。
今回はUIレイヤー（React + Vite + Zustand + Tailwind CSS）を実装し、ブラウザで動作するゲームを完成させる。

## 背景

前回の実装で以下が完成している:
- `src/types/` - 全型定義 (Quest, QuizQuestion, PuzzleData, PlayerProgress等)
- `src/repositories/` - データ層 (RailwayData, QuizData, PuzzleData, PlayerData)
- `src/services/` - ゲームロジック (QuestManager, QuizEngine, PuzzleEngine, ProgressManager, BadgeSystem, DailyChallengeManager)
- `public/data/` - 静的JSONデータ (路線、クイズ、パズル、クエスト)
- `tests/unit/` - 14テスト全て合格中

ただし、Reactのパッケージが未インストールのため、UIレイヤーがまだない。
今回はVite + React + Zustand + Tailwind CSSをインストールし、画面コンポーネントを実装する。

## 実装対象

### 環境セットアップ
- React 18.x、react-dom、@types/react、@types/react-dom
- Vite 6.x、@vitejs/plugin-react
- Zustand 5.x
- Tailwind CSS 3.x、postcss、autoprefixer

### Zustandストア
- `progressStore.ts` - プレイヤー進捗の状態管理
- `questStore.ts` - クエスト・クイズ・パズルのゲーム中状態管理
- `uiStore.ts` - 画面遷移・ナビゲーション状態管理

### UIコンポーネント
- 共通: Button, ProgressBar
- 画面: HomeScreen, QuestListScreen, QuestPlayScreen, CollectionScreen, DailyChallengeScreen
- クイズ: QuizContainer, QuizResult
- パズル: PuzzleContainer (SVGで路線図表示)

## 受け入れ条件

- [ ] `npm run dev` でViteの開発サーバーが起動し、ブラウザで動作確認できる
- [ ] ホーム画面が表示され、クエスト一覧へ遷移できる
- [ ] クエスト一覧からクエストを選択できる
- [ ] クイズに回答でき、正解/不正解のフィードバックが表示される
- [ ] パズルで路線図上の駅を選択して経路を作れる
- [ ] クエストクリア後に報酬が表示される
- [ ] 既存の14テストが引き続き全て通る
- [ ] `npm run typecheck` がエラーなし

## スコープ外

- バックエンドAPIサーバーの構築
- ユーザー認証
- ランキングシステム
- レベル2以上の詳細データ
