/**
 * クエスト関連の型定義
 */

import type { DifficultyLevel } from './common';
import type { QuizQuestion } from './quiz';
import type { PuzzleData } from './puzzle';

/**
 * クエストステップ
 */
export interface QuestStep {
  /** ステップの種類 */
  type: 'quiz' | 'puzzle' | 'challenge';
  /** コンテンツ (クイズ問題またはパズルデータ) */
  content: QuizQuestion[] | PuzzleData;
}

/**
 * 報酬
 */
export interface Reward {
  /** 報酬の種類 */
  type: 'railway_line' | 'vehicle_card' | 'badge' | 'points';
  /** 報酬ID */
  id: string;
  /** 報酬名 */
  name: string;
  /** レア度 */
  rarity?: 'common' | 'rare' | 'legendary';
}

/**
 * アンロック条件
 */
export interface UnlockCondition {
  /** 前提クエストID */
  requiredQuestIds?: string[];
  /** 必要レベル */
  requiredLevel?: DifficultyLevel;
}

/**
 * クエスト
 */
export interface Quest {
  /** クエストID (例: "quest-yamanote-01") */
  id: string;
  /** クエストタイトル (例: "山手線マスターへの道") */
  title: string;
  /** クエスト説明 */
  description: string;
  /** 難易度レベル (1-4) */
  level: DifficultyLevel;
  /** 対象路線ID */
  railwayLine: string;
  /** クエストステップ (クイズ→パズル→チャレンジ) */
  steps: QuestStep[];
  /** クリア報酬 */
  rewards: Reward[];
  /** アンロック条件 */
  unlockCondition?: UnlockCondition;
}

/**
 * クエストセッションの状態
 */
export type QuestStatus = 'in_progress' | 'completed' | 'failed';

/**
 * クエストセッション
 */
export interface QuestSession {
  /** セッションID */
  sessionId: string;
  /** クエストID */
  questId: string;
  /** 現在のステップインデックス */
  currentStepIndex: number;
  /** 開始日時 */
  startedAt: Date;
  /** 各ステップの結果 */
  results: StepResult[];
}

/**
 * ステップの結果
 */
export interface StepResult {
  /** ステップインデックス */
  stepIndex: number;
  /** 成功したか */
  success: boolean;
  /** スコア */
  score: number;
  /** 完了日時 */
  completedAt: Date;
}
