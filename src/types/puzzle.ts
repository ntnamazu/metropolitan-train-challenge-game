/**
 * パズル関連の型定義
 */

import type { RailwayMap } from './railway';

/**
 * パズルの種類
 */
export type PuzzleType =
  | 'route_selection' // 経路選択
  | 'transfer_puzzle' // 乗り換えパズル
  | 'direct_operation' // 相互直通
  | 'time_table' // 時刻表
  | 'optimization'; // 最適化

/**
 * パズルの制約条件
 */
export interface PuzzleConstraint {
  /** 制約の種類 */
  type: 'max_stations' | 'max_transfers' | 'specific_line';
  /** 制約の値 */
  value: number | string;
}

/**
 * パズルデータ
 */
export interface PuzzleData {
  /** パズルID */
  id: string;
  /** パズル種類 */
  type: PuzzleType;
  /** パズルタイトル */
  title: string;
  /** 説明 */
  description: string;
  /** 路線図データ */
  railwayMap: RailwayMap;
  /** 出発駅ID */
  startStation: string;
  /** 目的駅ID */
  goalStation: string;
  /** 制約条件 */
  constraints: PuzzleConstraint[];
  /** 制限時間 (秒) */
  timeLimit: number;
  /** 正解経路 (駅IDの配列) */
  correctPath: string[];
}

/**
 * パズルの状態
 */
export interface PuzzleState {
  /** パズルID */
  puzzleId: string;
  /** 選択した経路 */
  selectedPath: string[];
  /** 残り時間 */
  remainingTime: number;
  /** 状態 */
  status: 'in_progress' | 'completed' | 'failed';
}

/**
 * 経路選択の結果
 */
export interface PathSelection {
  /** 選択可能な駅か */
  valid: boolean;
  /** 現在の経路 */
  currentPath: string[];
  /** ゴールに到達したか */
  canComplete: boolean;
}

/**
 * パズルの検証結果
 */
export interface PuzzleResult {
  /** 成功したか */
  success: boolean;
  /** 実際の経路 */
  actualPath: string[];
  /** 正解経路 */
  correctPath: string[];
  /** 所要時間 */
  timeTaken: number;
  /** スコア */
  score: number;
}
