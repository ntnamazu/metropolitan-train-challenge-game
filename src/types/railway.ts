/**
 * 鉄道関連の型定義
 */

/**
 * 路線写真メタデータ
 */
export interface RailwayPhoto {
  /** 画像URL (Wikimedia CommonsのURL) */
  imageUrl: string;
  /** 撮影者名 */
  photographer: string;
  /** ライセンス種別 */
  license: 'CC0' | 'CC BY' | 'CC BY-SA';
  /** ライセンスバージョン (例: "4.0") */
  licenseVersion?: string;
  /** Wikimedia CommonsページのURL */
  commonsPageUrl: string;
}

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
  /** クイズ・フィードバック画面用写真プール (約5枚) */
  quizPhotos: RailwayPhoto[];
  /** フィードバック専用写真プール (当初は空配列) */
  feedbackPhotos: RailwayPhoto[];
  /** 路線アンロック演出用写真 (1枚) */
  unlockPhoto?: RailwayPhoto;
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
