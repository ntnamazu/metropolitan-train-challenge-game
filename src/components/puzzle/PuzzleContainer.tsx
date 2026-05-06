import { useState, useEffect, useRef } from 'react';
import type { PuzzleData, RailwayMap, Station, Connection } from '../../types';
import { Button } from '../common/Button';

interface PuzzleContainerProps {
  puzzleData: PuzzleData;
  railwayMap: RailwayMap;
  onComplete: (success: boolean, selectedPath: string[]) => void;
}

const SVG_PADDING = 40;
const STATION_RADIUS = 12;

function computeViewBox(stations: Station[]): {
  width: number;
  height: number;
  minX: number;
  minY: number;
} {
  if (stations.length === 0)
    return { width: 200, height: 100, minX: 0, minY: 0 };
  const xs = stations.map((s) => s.position.x);
  const ys = stations.map((s) => s.position.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const width = Math.max(...xs) - minX + SVG_PADDING * 2;
  const height = Math.max(...ys) - minY + SVG_PADDING * 2 + 30;
  return { width, height, minX, minY };
}

function getStationPos(station: Station, minX: number, minY: number) {
  return {
    x: station.position.x - minX + SVG_PADDING,
    y: station.position.y - minY + SVG_PADDING,
  };
}

function getLineColor(railwayMap: RailwayMap, connection: Connection): string {
  const line = railwayMap.lines.find((l) => l.id === connection.lineId);
  return line?.color ?? '#999';
}

export function PuzzleContainer({
  puzzleData,
  railwayMap,
  onComplete,
}: PuzzleContainerProps) {
  const [selectedPath, setSelectedPath] = useState<string[]>([
    puzzleData.startStation,
  ]);
  const [timeLeft, setTimeLeft] = useState(puzzleData.timeLimit);
  const [finished, setFinished] = useState(false);
  const [success, setSuccess] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishedRef = useRef(false);

  const isGoalReached =
    selectedPath[selectedPath.length - 1] === puzzleData.goalStation;

  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          if (!finishedRef.current) {
            setFinished(true);
            setSuccess(false);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const { width, height, minX, minY } = computeViewBox(railwayMap.stations);

  const isStationSelectable = (stationId: string): boolean => {
    if (finished) return false;
    const lastStation = selectedPath[selectedPath.length - 1];
    if (stationId === lastStation) return false;
    if (selectedPath.includes(stationId)) return false;
    return railwayMap.connections.some(
      (c) =>
        (c.fromStationId === lastStation && c.toStationId === stationId) ||
        (c.toStationId === lastStation && c.fromStationId === stationId)
    );
  };

  const handleStationClick = (stationId: string) => {
    if (!isStationSelectable(stationId)) return;
    const newPath = [...selectedPath, stationId];
    setSelectedPath(newPath);
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const succeeded = isGoalReached;
    setFinished(true);
    setSuccess(succeeded);
  };

  const handleFinishConfirm = () => {
    onComplete(success, selectedPath);
  };

  const isPathEdge = (fromId: string, toId: string): boolean =>
    selectedPath.some(
      (id, i) =>
        i < selectedPath.length - 1 &&
        ((id === fromId && selectedPath[i + 1] === toId) ||
          (id === toId && selectedPath[i + 1] === fromId))
    );

  const startStation = railwayMap.stations.find(
    (s) => s.id === puzzleData.startStation
  );
  const goalStation = railwayMap.stations.find(
    (s) => s.id === puzzleData.goalStation
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
          パズル
        </span>
        <span
          className={`font-mono font-bold text-lg ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-700'}`}
        >
          ⏱ {timeLeft}秒
        </span>
      </div>

      <div className="bg-white rounded-xl p-4 shadow">
        <h3 className="font-bold text-gray-800 mb-1">{puzzleData.title}</h3>
        <p className="text-sm text-gray-500 mb-3">{puzzleData.description}</p>
        <div className="flex gap-4 text-sm mb-3">
          <span className="text-green-700">🟢 出発: {startStation?.name}</span>
          <span className="text-red-700">🔴 目的: {goalStation?.name}</span>
        </div>
        {puzzleData.constraints.length > 0 && (
          <div className="text-xs text-gray-500">
            {puzzleData.constraints.map((c, i) => (
              <span key={i} className="mr-2">
                {c.type === 'max_stations' && `経由駅: ${c.value}駅以内`}
                {c.type === 'max_transfers' && `乗り換え: ${c.value}回以内`}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow overflow-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          style={{ minHeight: 120, maxHeight: 200 }}
        >
          {railwayMap.connections.map((conn, i) => {
            const from = railwayMap.stations.find(
              (s) => s.id === conn.fromStationId
            );
            const to = railwayMap.stations.find(
              (s) => s.id === conn.toStationId
            );
            if (!from || !to) return null;
            const fp = getStationPos(from, minX, minY);
            const tp = getStationPos(to, minX, minY);
            const isSelected = isPathEdge(conn.fromStationId, conn.toStationId);
            const lineColor = getLineColor(railwayMap, conn);
            return (
              <line
                key={i}
                x1={fp.x}
                y1={fp.y}
                x2={tp.x}
                y2={tp.y}
                stroke={isSelected ? '#2563EB' : lineColor}
                strokeWidth={isSelected ? 5 : 4}
                strokeOpacity={isSelected ? 1 : 0.6}
              />
            );
          })}
          {railwayMap.stations.map((station) => {
            const pos = getStationPos(station, minX, minY);
            const isStart = station.id === puzzleData.startStation;
            const isGoal = station.id === puzzleData.goalStation;
            const isSelected = selectedPath.includes(station.id);
            const canSelect = isStationSelectable(station.id);
            let fill = '#fff';
            if (isStart) fill = '#22c55e';
            else if (isGoal) fill = '#ef4444';
            else if (isSelected) fill = '#3b82f6';
            else if (canSelect) fill = '#dbeafe';
            return (
              <g
                key={station.id}
                onClick={() => handleStationClick(station.id)}
                style={{ cursor: canSelect ? 'pointer' : 'default' }}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={STATION_RADIUS}
                  fill={fill}
                  stroke={canSelect ? '#2563EB' : '#999'}
                  strokeWidth={canSelect ? 2.5 : 1.5}
                />
                <text
                  x={pos.x}
                  y={pos.y + STATION_RADIUS + 12}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#374151"
                >
                  {station.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
        選択中:{' '}
        {selectedPath
          .map((id) => railwayMap.stations.find((s) => s.id === id)?.name)
          .join(' → ')}
      </div>

      {!finished ? (
        <Button
          onClick={handleSubmit}
          disabled={!isGoalReached}
          className="w-full py-3"
        >
          {isGoalReached
            ? '経路を確定する ✓'
            : 'ゴール駅に到達してから確定できます'}
        </Button>
      ) : (
        <div>
          <div
            className={`rounded-xl p-4 mb-3 ${success ? 'bg-green-50 border border-green-300' : 'bg-red-50 border border-red-300'}`}
          >
            <p className="font-bold text-lg mb-1">
              {success ? '🎉 正解！' : '😢 不正解...'}
            </p>
            <p className="text-sm text-gray-600">
              {success
                ? '正しい経路でゴールに到達しました！'
                : timeLeft === 0
                  ? '時間切れです。'
                  : 'もう一度挑戦してみましょう。'}
            </p>
          </div>
          <Button onClick={handleFinishConfirm} className="w-full py-3">
            次へ進む →
          </Button>
        </div>
      )}
    </div>
  );
}
