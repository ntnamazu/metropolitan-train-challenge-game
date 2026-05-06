/**
 * プレイヤー関連の型定義
 */

import type { DifficultyLevel } from './common';

/**
 * バッジ
 */
export interface Badge {
  /** バッジID */
  id: string;
  /** バッジ名 */
  name: string;
  /** 説明 */
  description: string;
  /** 獲得日時 */
  earnedAt: Date;
}

/**
 * デイリーチャレンジの進捗
 */
export interface DailyChallengeProgress {
  /** 日付 (YYYY-MM-DD) */
  date: string;
  /** 今日のクエストID */
  questId: string;
  /** 完了フラグ */
  completed: boolean;
  /** ボーナスポイント */
  bonusPoints: number;
}

/**
 * プレイヤーの統計情報
 */
export interface PlayerStatistics {
  /** 総クイズ回答数 */
  totalQuizzes: number;
  /** 正解数 */
  correctQuizzes: number;
  /** 総パズル挑戦数 */
  totalPuzzles: number;
  /** クリア数 */
  completedPuzzles: number;
  /** 平均プレイ時間 (分) */
  averagePlayTime: number;
  /** 連続プレイ日数 */
  consecutiveDays: number;
}

/**
 * プレイヤーの進捗
 */
export interface PlayerProgress {
  /** プレイヤーID (UUID) */
  playerId: string;
  /** 現在のレベル */
  currentLevel: DifficultyLevel;
  /** クリア済みクエストID */
  completedQuestIds: string[];
  /** アンロック済み路線ID */
  unlockedLineIds: string[];
  /** アンロック済み車両ID */
  unlockedVehicleIds: string[];
  /** 獲得バッジ */
  badges: Badge[];
  /** 累計ポイント */
  totalPoints: number;
  /** デイリーチャレンジ進捗 */
  dailyChallenge: DailyChallengeProgress;
  /** 統計情報 */
  statistics: PlayerStatistics;
  /** 作成日時 */
  createdAt: Date;
  /** 最終プレイ日時 */
  lastPlayedAt: Date;
}
