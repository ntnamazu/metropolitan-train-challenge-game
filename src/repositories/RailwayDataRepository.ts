/**
 * 路線データリポジトリ
 */

import type { RailwayMap, Station, RailwayLine } from '../types';
import { NotFoundError } from '../types';

export class RailwayDataRepository {
  private railwayMapCache: RailwayMap | null = null;

  /**
   * 路線図データを読み込む
   */
  async loadRailwayMap(): Promise<RailwayMap> {
    if (this.railwayMapCache) {
      return this.railwayMapCache;
    }

    try {
      const indexResponse = await fetch('/data/railways/index.json');
      if (!indexResponse.ok) {
        throw new NotFoundError('RailwayData', 'index');
      }
      const index = (await indexResponse.json()) as { files: string[] };

      const maps = await Promise.all(
        index.files.map(async (file) => {
          const response = await fetch(`/data/railways/${file}`);
          if (!response.ok) {
            throw new NotFoundError('RailwayData', file);
          }
          return (await response.json()) as RailwayMap;
        })
      );

      this.railwayMapCache = {
        stations: maps.flatMap((m) => m.stations),
        lines: maps.flatMap((m) => m.lines),
        connections: maps.flatMap((m) => m.connections),
      };

      return this.railwayMapCache;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new NotFoundError('RailwayData', 'unknown');
    }
  }

  /**
   * 駅IDから駅情報を取得
   */
  async getStationById(stationId: string): Promise<Station> {
    const railwayMap = await this.loadRailwayMap();
    const station = railwayMap.stations.find((s) => s.id === stationId);

    if (!station) {
      throw new NotFoundError('Station', stationId);
    }

    return station;
  }

  /**
   * 路線IDから路線情報を取得
   */
  async getLineById(lineId: string): Promise<RailwayLine> {
    const railwayMap = await this.loadRailwayMap();
    const line = railwayMap.lines.find((l) => l.id === lineId);

    if (!line) {
      throw new NotFoundError('RailwayLine', lineId);
    }

    return line;
  }
}
