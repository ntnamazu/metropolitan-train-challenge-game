/**
 * 鉄道関連の型定義
 */

/**
 * 駅
 */
export interface Station {
  /** 駅ID (例: "st-shibuya") */
  id: string;
  /** 駅名 (例: "渋谷") */
  name: string;
  /** 停車する路線ID */
  lines: string[];
  /** 路線図上の座標 */
  position: { x: number; y: number };
}

/**
 * 路線
 */
export interface RailwayLine {
  /** 路線ID (例: "line-yamanote") */
  id: string;
  /** 路線名 (例: "山手線") */
  name: string;
  /** 運営会社 (例: "JR東日本") */
  company: string;
  /** 路線カラー (例: "#9ACD32") */
  color: string;
  /** 分類 */
  category: 'jr' | 'private' | 'metro';
  /** 駅IDの順序付きリスト */
  stations: string[];
}

/**
 * 駅間の接続情報
 */
export interface Connection {
  /** 出発駅ID */
  fromStationId: string;
  /** 到着駅ID */
  toStationId: string;
  /** 路線ID */
  lineId: string;
  /** 所要時間 (分) */
  travelTime: number;
}

/**
 * 路線図
 */
export interface RailwayMap {
  /** 駅のリスト */
  stations: Station[];
  /** 路線のリスト */
  lines: RailwayLine[];
  /** 接続情報 */
  connections: Connection[];
}
