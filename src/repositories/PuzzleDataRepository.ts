/**
 * パズルデータリポジトリ
 */

import type { PuzzleData } from '../types';
import { NotFoundError } from '../types';
import type { RailwayDataRepository } from './RailwayDataRepository';

export class PuzzleDataRepository {
  constructor(private railwayDataRepository: RailwayDataRepository) {}

  /**
   * クエストIDに紐づくパズル問題を読み込む
   */
  async loadPuzzleByQuestId(questId: string): Promise<PuzzleData> {
    try {
      // クエストIDから路線名を抽出 (例: "quest-sobu-01" → "sobu")
      const match = questId.match(/quest-(.+)-(\d+)/);
      if (!match) {
        throw new NotFoundError('PuzzleData', questId);
      }

      const lineName = match[1];
      const questNumber = match[2];
      const response = await fetch(
        `/data/puzzles/level1/${lineName}-puzzle-${questNumber}.json`
      );

      if (!response.ok) {
        throw new NotFoundError('PuzzleData', questId);
      }

      const puzzleData = (await response.json()) as PuzzleData;

      const railwayMap = await this.railwayDataRepository.loadRailwayMap();

      const startStation = railwayMap.stations.find(
        (s) => s.id === puzzleData.startStation
      );
      const goalStation = railwayMap.stations.find(
        (s) => s.id === puzzleData.goalStation
      );

      if (!startStation)
        throw new NotFoundError('Station', puzzleData.startStation);
      if (!goalStation)
        throw new NotFoundError('Station', puzzleData.goalStation);

      // 路線データはそれぞれ独立した座標系(x=0起点)を持つため、統合マップをそのままSVGに
      // 描画すると異なる路線の駅が同一ピクセル位置に重なる。パズルのstart/goalが属する
      // 路線のみに絞り込んだ部分マップを渡すことで重なりを防ぐ。
      const relevantLineIds = new Set([
        ...startStation.lines,
        ...goalStation.lines,
      ]);

      puzzleData.railwayMap = {
        stations: railwayMap.stations.filter((s) =>
          s.lines.some((l) => relevantLineIds.has(l))
        ),
        lines: railwayMap.lines.filter((l) => relevantLineIds.has(l.id)),
        connections: railwayMap.connections.filter((c) =>
          relevantLineIds.has(c.lineId)
        ),
      };

      return puzzleData;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new NotFoundError('PuzzleData', questId);
    }
  }
}
