# 要求内容

## 概要

`docs/development-guidelines.md` のレビュー指摘事項（5件）を修正し、他のドキュメントとの整合性と正確性を向上させる。

## 背景

doc-reviewerによるレビューで、architecture.mdとの乖離や構造的な問題が発見された。devcontainer環境を使う実際の開発フローと、ガイドラインの記述が一致していないため、新メンバーが混乱するリスクがある。

## 実装対象の機能

### 1. devcontainer/Docker手順の追加（必須）
- 「必要なツール」表にDocker Desktop と VS Code Dev Containers 拡張機能を追加
- 「セットアップ手順」にdevcontainer（推奨）とローカル環境（サブ手段）の2つの手順を記載
- コンポーネントテストの実行方法にDocker版コマンドを追加

### 2. チェックリストのMarkdown構造修正（必須）
- 「チェックリスト」見出し下のh3サブセクション（コード品質、セキュリティ、パフォーマンス、テスト、ドキュメント、ツール）を適切に整理する
- 見出しとリスト項目の構造的な乖離を解消する

### 3. カバレッジ設定のtypo修正（推奨）
- vitest.config.ts サンプルコード内の `"threshold"` → `"thresholds"` に修正

### 4. CI/CD設定をarchitecture.mdと統一（推奨）
- GitHub ActionsのワークフローをDockerベース（architecture.mdの正式版）に更新する

### 5. コードレビュー基準にアーキテクチャ遵守チェック追加（推奨）
- 「レビューポイント」にアーキテクチャカテゴリを追加
- レイヤー間依存方向の確認チェック項目を追加

## 受け入れ条件

### devcontainer/Docker手順
- [ ] 「必要なツール」表にDocker DesktopとVS Code Dev Containers拡張機能が追加されている
- [ ] 「セットアップ手順」にdevcontainer（推奨）とローカル環境の両方の手順がある
- [ ] コンポーネントテスト実行方法にDocker版コマンドが追加されている

### チェックリスト構造
- [ ] 「チェックリスト」見出しとサブセクションの構造が一貫している

### カバレッジ設定
- [ ] `"threshold"` が `"thresholds"` に修正されている

### CI/CD設定
- [ ] CI/CDワークフローがDockerベースのコマンドを使用している

### アーキテクチャレビュー
- [ ] 「レビューポイント」にアーキテクチャカテゴリが追加されている

## スコープ外

- development-guidelines.md 以外のドキュメントへの変更
- コード実装（docs修正のみ）

## 参照ドキュメント

- `docs/development-guidelines.md` - 修正対象
- `docs/architecture.md` - Docker/CI設定の正式版
