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
      // JR中央・総武線各駅停車と東武亀戸線のデータを読み込む
      const sobuResponse = await fetch('/data/railways/jr/sobu.json');
      const tobuKamedoResponse = await fetch(
        '/data/railways/private/tobu-kamedo.json'
      );

      if (!sobuResponse.ok) {
        throw new NotFoundError('RailwayData', 'sobu');
      }

      if (!tobuKamedoResponse.ok) {
        throw new NotFoundError('RailwayData', 'tobu-kamedo');
      }

      const sobuData = (await sobuResponse.json()) as RailwayMap;
      const tobuKamedoData = (await tobuKamedoResponse.json()) as RailwayMap;

      // データを統合
      this.railwayMapCache = {
        stations: [...sobuData.stations, ...tobuKamedoData.stations],
        lines: [...sobuData.lines, ...tobuKamedoData.lines],
        connections: [...sobuData.connections, ...tobuKamedoData.connections],
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
