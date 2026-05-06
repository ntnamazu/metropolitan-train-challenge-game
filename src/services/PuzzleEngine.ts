/**
 * パズルエンジン
 */

import type {
  PuzzleData,
  PuzzleState,
  PathSelection,
  PuzzleResult,
  RailwayMap,
  PuzzleConstraint,
} from '../types';
import { ValidationError } from '../types';
import type { PuzzleDataRepository } from '../repositories/PuzzleDataRepository';
import type { RailwayDataRepository } from '../repositories/RailwayDataRepository';

export class PuzzleEngine {
  private puzzleStates: Map<string, { state: PuzzleState; startTime: number }> =
    new Map();

  constructor(
    private _puzzleDataRepository: PuzzleDataRepository,
    private railwayDataRepository: RailwayDataRepository
  ) {}

  /**
   * パズルを初期化
   */
  async initializePuzzle(puzzleData: PuzzleData): Promise<PuzzleState> {
    const state: PuzzleState = {
      puzzleId: puzzleData.id,
      selectedPath: [puzzleData.startStation],
      remainingTime: puzzleData.timeLimit,
      status: 'in_progress',
    };

    this.puzzleStates.set(puzzleData.id, {
      state,
      startTime: Date.now(),
    });

    return state;
  }

  /**
   * 駅を選択
   */
  async selectStation(
    puzzleId: string,
    stationId: string
  ): Promise<PathSelection> {
    const puzzleStateData = this.puzzleStates.get(puzzleId);
    if (!puzzleStateData) {
      throw new ValidationError(
        'パズルが初期化されていません',
        'puzzleId',
        puzzleId
      );
    }

    const { state } = puzzleStateData;
    const currentStationId = state.selectedPath[state.selectedPath.length - 1];
    const railwayMap = await this.railwayDataRepository.loadRailwayMap();

    // 選択可能な駅かチェック（直接接続されているか）
    const isConnected = railwayMap.connections.some(
      (conn) =>
        conn.fromStationId === currentStationId &&
        conn.toStationId === stationId
    );

    if (!isConnected) {
      return {
        valid: false,
        currentPath: state.selectedPath,
        canComplete: false,
      };
    }

    // 経路に追加
    const newPath = [...state.selectedPath, stationId];
    state.selectedPath = newPath;

    // ゴールに到達したかチェック（現在実装中のパズルデータからゴール駅を取得する必要があるが、
    // ここでは簡略化のため、パズルデータを再取得せずにstateのみ更新）
    const canComplete = false; // 実際にはpuzzleData.goalStationと比較

    return {
      valid: true,
      currentPath: newPath,
      canComplete,
    };
  }

  /**
   * 経路を検証
   */
  async validatePath(
    puzzleId: string,
    selectedPath: string[]
  ): Promise<PuzzleResult> {
    const puzzleStateData = this.puzzleStates.get(puzzleId);
    if (!puzzleStateData) {
      throw new ValidationError(
        'パズルが初期化されていません',
        'puzzleId',
        puzzleId
      );
    }

    // パズルデータを取得（ここでは簡略化のため、クエストIDからパズルデータを取得する）
    // 実際にはpuzzleDataをキャッシュするか、別途渡す必要がある
    // 今は簡略化のため、エラーを返す
    const railwayMap = await this.railwayDataRepository.loadRailwayMap();

    // ステップ1: 連続性チェック
    const isContinuous = this.validatePathContinuity(selectedPath, railwayMap);
    if (!isContinuous) {
      return {
        success: false,
        actualPath: selectedPath,
        correctPath: [], // 実際にはpuzzleData.correctPathを返す
        timeTaken: 0,
        score: 0,
      };
    }

    // ステップ2: 制約チェック（仮実装）
    // 実装は省略

    // ステップ3: スコア計算
    const timeTaken = (Date.now() - puzzleStateData.startTime) / 1000; // 秒に変換
    const score = this.calculatePuzzleScore(selectedPath, [], timeTaken, 60);

    return {
      success: true,
      actualPath: selectedPath,
      correctPath: [], // 実際にはpuzzleData.correctPathを返す
      timeTaken,
      score,
    };
  }

  /**
   * 経路の連続性チェック
   */
  private validatePathContinuity(
    selectedPath: string[],
    railwayMap: RailwayMap
  ): boolean {
    for (let i = 0; i < selectedPath.length - 1; i++) {
      const currentStation = selectedPath[i];
      const nextStation = selectedPath[i + 1];

      const connection = railwayMap.connections.find(
        (c) =>
          c.fromStationId === currentStation && c.toStationId === nextStation
      );

      if (!connection) {
        return false;
      }
    }

    return true;
  }

  /**
   * 制約条件のチェック
   */
  private validateConstraints(
    selectedPath: string[],
    constraints: PuzzleConstraint[],
    railwayMap: RailwayMap
  ): boolean {
    for (const constraint of constraints) {
      switch (constraint.type) {
        case 'max_stations': {
          if (selectedPath.length > (constraint.value as number)) {
            return false;
          }
          break;
        }

        case 'max_transfers': {
          const transferCount = this.countTransfers(selectedPath, railwayMap);
          if (transferCount > (constraint.value as number)) {
            return false;
          }
          break;
        }

        case 'specific_line': {
          if (
            !this.pathUsesLine(
              selectedPath,
              constraint.value as string,
              railwayMap
            )
          ) {
            return false;
          }
          break;
        }
      }
    }

    return true;
  }

  /**
   * 乗り換え回数をカウント
   */
  private countTransfers(path: string[], railwayMap: RailwayMap): number {
    let transfers = 0;
    let currentLine: string | null = null;

    for (let i = 0; i < path.length - 1; i++) {
      const connection = railwayMap.connections.find(
        (c) => c.fromStationId === path[i] && c.toStationId === path[i + 1]
      );

      if (connection) {
        if (currentLine && currentLine !== connection.lineId) {
          transfers++;
        }
        currentLine = connection.lineId;
      }
    }

    return transfers;
  }

  /**
   * 経路が特定の路線を使っているかチェック
   */
  private pathUsesLine(
    path: string[],
    lineId: string,
    railwayMap: RailwayMap
  ): boolean {
    for (let i = 0; i < path.length - 1; i++) {
      const connection = railwayMap.connections.find(
        (c) =>
          c.fromStationId === path[i] &&
          c.toStationId === path[i + 1] &&
          c.lineId === lineId
      );

      if (connection) {
        return true;
      }
    }

    return false;
  }

  /**
   * パズルのスコアを計算
   */
  private calculatePuzzleScore(
    selectedPath: string[],
    correctPath: string[],
    timeTaken: number,
    timeLimit: number
  ): number {
    let score = 0;

    // 基本スコア: 正解なら50点
    if (this.arraysEqual(selectedPath, correctPath)) {
      score += 50;
    }

    // 時間ボーナス: 早くクリアするほど高得点 (最大30点)
    const timeRatio = 1 - timeTaken / timeLimit;
    score += Math.floor(timeRatio * 30);

    // 効率ボーナス: 最小駅数・乗り換えなら追加点 (最大20点)
    // 実装は省略

    return Math.min(score, 100); // 最大100点
  }

  /**
   * 配列が等しいかチェック
   */
  private arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }
}
