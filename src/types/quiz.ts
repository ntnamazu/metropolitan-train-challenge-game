/**
 * クイズ関連の型定義
 */

import type { DifficultyLevel } from './common';

/**
 * クイズのカテゴリ
 */
export type QuizCategory =
  | 'station_name' // 駅名
  | 'line_name' // 路線名
  | 'travel_time' // 所要時間
  | 'transfer' // 乗り換え
  | 'company_features' // 会社の特色
  | 'direct_operation'; // 相互直通運転

/**
 * クイズ回答セッションの状態
 */
export type QuizStatus = 'answering' | 'correct' | 'incorrect';

/**
 * クイズ問題
 */
export interface QuizQuestion {
  /** 問題ID */
  id: string;
  /** カテゴリ */
  category: QuizCategory;
  /** 問題文 */
  question: string;
  /** 選択肢 (4つ) */
  choices: string[];
  /** 正解のインデックス (0-3) */
  correctIndex: number;
  /** 解説・豆知識 */
  explanation: string;
  /** 難易度 */
  difficulty: DifficultyLevel;
}

/**
 * クイズの採点結果
 */
export interface QuizResult {
  /** 正解かどうか */
  correct: boolean;
  /** 正解のインデックス */
  correctIndex: number;
  /** 解説 */
  explanation: string;
}
