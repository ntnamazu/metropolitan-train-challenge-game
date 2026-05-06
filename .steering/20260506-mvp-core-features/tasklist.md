# タスクリスト

## 🚨 タスク完全完了の原則

**このファイルの全タスクが完了するまで作業を継続すること**

### 必須ルール
- **全てのタスクを`[x]`にすること**
- 「時間の都合により別タスクとして実施予定」は禁止
- 「実装が複雑すぎるため後回し」は禁止
- 未完了タスク（`[ ]`）を残したまま作業を終了しない

---

## フェーズ1: 環境セットアップ

- [x] 依存パッケージのインストール
  - [x] React 19.x、react-dom、@types/react、@types/react-domをインストール
  - [x] Vite 8.x、@vitejs/plugin-reactをインストール
  - [x] Zustand 5.xをインストール
  - [x] Tailwind CSS 4.x（@tailwindcss/vite）をインストール

- [x] 設定ファイルの更新・作成
  - [x] `vite.config.ts`を作成（@tailwindcss/viteプラグイン採用。v4のためtailwind.config.jsは不要）
  - [x] ~~`tailwind.config.js`を作成~~ （Tailwind v4はJSコンフィグ不要）
  - [x] ~~`postcss.config.js`を作成~~ （@tailwindcss/viteプラグインを使用するため不要）
  - [x] `tsconfig.json`にJSXサポートを追加（jsx: react-jsx）
  - [x] `package.json`のscriptsを更新（dev: vite, build: vite build）

- [x] エントリーファイルの作成
  - [x] `index.html`を作成
  - [x] `src/index.css`にTailwind v4ディレクティブを追加（`@import "tailwindcss"`）
  - [x] `src/main.tsx`を作成（Reactエントリーポイント）

## フェーズ2: サービスインスタンスの設定

- [x] `src/services/instances.ts`を作成
  - [x] 全リポジトリ・サービスのシングルトンインスタンスをエクスポート

## フェーズ3: Zustandストアの実装

- [x] `src/stores/uiStore.ts`を実装
  - [x] currentScreen状態（home/quest-list/quest-play/collection/daily-challenge）
  - [x] navigate()アクション

- [x] `src/stores/progressStore.ts`を実装
  - [x] PlayerProgress状態
  - [x] initProgress()（ProgressManagerから読み込み、なければ初期作成）
  - [x] updateProgress()
  - [x] completeQuest()（クエスト完了時の進捗更新）

- [x] `src/stores/questStore.ts`を実装
  - [x] 利用可能クエスト、選択中クエスト、セッション状態
  - [x] クイズ・パズルのゲーム中状態
  - [x] loadAvailableQuests()、selectQuest()、startQuest()
  - [x] submitQuizAnswer()、nextQuiz()
  - [x] initializePuzzle()、selectPuzzleStation()、submitPuzzle()
  - [x] completeStep()、resetQuest()

- [x] `src/stores/index.ts`を作成（ストアのエクスポート）

## フェーズ4: 共通コンポーネントの実装

- [x] `src/components/common/Button.tsx`を実装
  - [x] variant（primary/secondary/danger）、disabled、onClick対応

- [x] `src/components/common/ProgressBar.tsx`を実装
  - [x] value/max props、進捗バー表示

## フェーズ5: Appコンポーネントの実装

- [x] `src/App.tsx`を実装
  - [x] uiStoreのcurrentScreenに応じた画面切り替え

## フェーズ6: 画面コンポーネントの実装

- [x] `src/components/screens/HomeScreen.tsx`を実装
  - [x] タイトル表示
  - [x] プレイヤー進捗サマリー（レベル、クリア数、ポイント）
  - [x] 「クエストを始める」「コレクション」「デイリーチャレンジ」ボタン

- [x] `src/components/screens/QuestListScreen.tsx`を実装
  - [x] クエスト一覧表示（loadAvailableQuestsを呼び出す）
  - [x] クリア済みクエストのバッジ表示
  - [x] クエスト選択→QuestPlayScreen遷移

- [x] `src/components/screens/QuestPlayScreen.tsx`を実装
  - [x] ステップ進行管理（quiz→puzzle→challenge→完了）
  - [x] 各ステップに対応するコンポーネントの表示
  - [x] クエスト完了モーダル（報酬表示）

- [x] `src/components/screens/CollectionScreen.tsx`を実装
  - [x] 獲得バッジ一覧
  - [x] 総ポイント表示
  - [x] 「戻る」ボタン

- [x] `src/components/screens/DailyChallengeScreen.tsx`を実装
  - [x] 今日のデイリーチャレンジ表示
  - [x] 完了済みかどうかのチェック
  - [x] チャレンジ開始ボタン

## フェーズ7: クイズコンポーネントの実装

- [x] `src/components/quiz/QuizContainer.tsx`を実装
  - [x] 問題番号、問題文の表示
  - [x] 4択ボタン（回答前後で状態変化）
  - [x] 正解/不正解フィードバック表示
  - [x] 解説テキスト表示
  - [x] 「次の問題」/「パズルへ進む」ボタン

## フェーズ8: パズルコンポーネントの実装

- [x] `src/components/puzzle/PuzzleContainer.tsx`を実装
  - [x] 問題説明表示（出発駅→目的駅、制約条件）
  - [x] カウントダウンタイマー（setInterval）
  - [x] SVGで路線図表示
    - [x] 路線（線）の描画（路線カラーで色分け）
    - [x] 駅（丸）の描画（クリック可能）
    - [x] スタート駅・ゴール駅のハイライト
    - [x] 選択済み経路のハイライト
    - [x] 駅名ラベルの表示
  - [x] 「経路を確定する」ボタン（ゴール駅を選択した後に有効化）
  - [x] 結果表示（成功/失敗）

## フェーズ9: 品質チェック

- [x] `npm run typecheck`がエラーなし
- [x] `npm test`が全テスト通過（14テスト）
- [x] `npm run lint`がエラーなし（6件の警告のみ、既存コードに起因）
- [x] `npm run build`でViteビルドが成功

---

## 実装後の振り返り

### 実装完了日
2026-05-06

### 計画と実績の差分

**計画と異なった点**:
- **Tailwind CSS v4の採用**: アーキテクチャ設計書はv3を指定していたが、npmが最新のv4.2.4をインストール。v4はJSコンフィグ不要・`@tailwindcss/vite`プラグイン採用のため、`postcss.config.js`と`tailwind.config.js`は不要になった
- **React v19の採用**: 設計書はv18指定だったが、v19.2.6がインストールされた。v19の新機能は使用していないため互換性は問題なし
- **Vite v8の採用**: 設計書はv6指定だったが、v8.0.10がインストールされた

**新たに必要になったタスク**:
- バリデーションで指摘されたアーキテクチャ違反の修正（UIからリポジトリ直接アクセス→instances.ts経由に統一）
- QuizContainerのstale closure修正（useEffect + readyToCompleteフラグで解決）
- PuzzleContainerのタイマー再起動問題修正（finishedRefを使い依存配列をから`finished`を除去）
- progressStoreのポイント報酬計算改善（Reward.nameから数値を正規表現でパース）

### 学んだこと

**技術的な学び**:
- Tailwind CSS v4では`tailwind.config.js`が不要になり、CSSファーストの設定アプローチに移行している。`@import "tailwindcss"`一行で全ユーティリティが使えるようになった
- Zustandのシングルトン設計（instances.ts）とUIコンポーネントの疎結合化の重要性。UIがリポジトリを直接インスタンス化するとアーキテクチャの境界が崩れる
- Reactのstate更新の非同期性によるstale closure問題。最終問題の結果を確実に`onComplete`に渡すために`useEffect`と`readyToComplete`フラグで解決する手法が有効

**プロセス上の改善点**:
- バリデーションサブエージェントがアーキテクチャ違反を適切に検出した。設計書のルール（UIレイヤーはデータレイヤーに直接アクセス禁止）を明確に定義しておくことの重要性を再確認

### 次回への改善提案
- **コンポーネントテストの追加**: QuizContainer（4択クリック動作）とPuzzleContainer（タイマー・駅選択）のテストをReact Testing Libraryで作成することが最優先
- **questStore.loadAvailableQuestsのレベル対応**: 現在レベル1固定だが、progressStoreから現在レベルを取得して動的に変更する
- **レベル2以上のデータ追加**: コアロジックはレベル2以上に対応済みだが、静的データが未作成。次のフェーズで路線データ・クイズ・パズルを追加する
