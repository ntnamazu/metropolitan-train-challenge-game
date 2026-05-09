# 設計書

## 変更概要

`docs/development-guidelines.md` への5箇所の修正。すべてドキュメント内容の修正であり、コード変更はなし。

## 変更箇所詳細

### 1. 必要なツール表（line 884〜888）

**現在**:
| ツール | バージョン | インストール方法 |
|--------|-----------|-----------------|
| Node.js | v24.11.0 | https://nodejs.org/ |
| npm | 11.x | Node.jsに同梱 |
| Git | 最新版 | https://git-scm.com/ |

**変更後**: Docker Desktop と VS Code Dev Containers 拡張機能を追加

### 2. セットアップ手順（line 890〜903）

**変更方針**:
- devcontainer（推奨）を最初に記載
- ローカル環境はサブ手段として位置づけ
- architecture.mdの「docker compose up」フローを参照

### 3. コンポーネントテスト実行方法（line 702〜709）

**変更方針**:
- Docker版コマンドを追記: `docker compose run --rm app npm run test -- --testPathPattern=components`

### 4. カバレッジ設定（line 788）

**変更内容**: `"threshold"` → `"thresholds"` （Vitestの正しいキー名）

### 5. CI/CD設定（line 970〜987）

**変更方針**:
- architecture.mdのCI設定（Docker経由）と整合させる
- ローカルの`npm ci` → `docker compose run --rm app`形式に変更

### 6. コードレビュー基準（line 836〜840付近）

**追加内容**:
```markdown
**アーキテクチャ**:
- [ ] レイヤー間の依存方向が正しいか（UIレイヤー→サービス→リポジトリ）
- [ ] repositories/からservices/またはcomponents/に依存していないか
- [ ] 循環依存が発生していないか
```

### 7. チェックリスト構造（line 1057〜1093）

**変更方針**:
- 「チェックリスト」h3見出しの直下に「#### 実装完了前に確認」などのサブセクション見出しを追加
- または「### チェックリスト」を「## 実装完了前チェックリスト」として独立させ、h3サブセクションとの整合を取る

## 実装の順序

1. カバレッジ設定のtypo修正（最小変更）
2. コードレビュー基準にアーキテクチャチェック追加
3. CI/CD設定をarchitecture.mdと統一
4. 必要なツール表にDocker情報追加
5. セットアップ手順にdevcontainer/Docker手順追加
6. コンポーネントテストにDocker版コマンド追加
7. チェックリスト構造の修正
