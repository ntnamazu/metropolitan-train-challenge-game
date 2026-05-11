import { useEffect, useState } from 'react';
import { useUiStore, useProgressStore } from '../../stores';
import { Button } from '../common/Button';
import { badgeSystem, vehicleCardRepository } from '../../services/instances';
import type { BadgeDefinition } from '../../services/BadgeSystem';
import type { VehicleCard } from '../../types';

const RARITY_LABEL: Record<VehicleCard['rarity'], string> = {
  common: 'コモン',
  rare: 'レア',
  legendary: 'レジェンダリー',
};

const RARITY_BORDER: Record<VehicleCard['rarity'], string> = {
  common: 'border-gray-300',
  rare: 'border-blue-400',
  legendary: 'border-yellow-400',
};

const RARITY_BADGE_COLOR: Record<VehicleCard['rarity'], string> = {
  common: 'bg-gray-200 text-gray-700',
  rare: 'bg-blue-100 text-blue-700',
  legendary: 'bg-yellow-100 text-yellow-700',
};

const RARITY_ORDER: VehicleCard['rarity'][] = ['legendary', 'rare', 'common'];

export function CollectionScreen() {
  const navigate = useUiStore((s) => s.navigate);
  const progress = useProgressStore((s) => s.progress);
  const [allBadgeDefs, setAllBadgeDefs] = useState<BadgeDefinition[]>([]);
  const [allVehicleCards, setAllVehicleCards] = useState<VehicleCard[]>([]);

  useEffect(() => {
    badgeSystem
      .loadBadgeDefinitions()
      .then(() => {
        setAllBadgeDefs(badgeSystem.getAllBadgeDefinitions());
      })
      .catch((err) =>
        console.error('バッジデータの読み込みに失敗しました', err)
      );

    vehicleCardRepository
      .loadVehicleCards()
      .then((cards) => {
        setAllVehicleCards(cards);
      })
      .catch((err) =>
        console.error('車両カードデータの読み込みに失敗しました', err)
      );
  }, []);

  const earnedBadgeIds = new Set(progress?.badges.map((b) => b.id) ?? []);
  const earnedBadges = allBadgeDefs.filter((d) => earnedBadgeIds.has(d.id));
  const unearnedBadges = allBadgeDefs.filter((d) => !earnedBadgeIds.has(d.id));

  const unlockedVehicleIds = new Set(progress?.unlockedVehicleIds ?? []);
  const sortedVehicleCards = RARITY_ORDER.flatMap((rarity) =>
    allVehicleCards.filter((c) => c.rarity === rarity)
  );

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button onClick={() => navigate('home')} variant="secondary">
          ← 戻る
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">コレクション</h2>
      </div>

      {progress && (
        <>
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <h3 className="font-bold text-gray-700 mb-2">統計</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {progress.totalPoints}
                </p>
                <p className="text-xs text-gray-500">総ポイント</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {progress.completedQuestIds.length}
                </p>
                <p className="text-xs text-gray-500">クリアクエスト数</p>
              </div>
            </div>
          </div>

          {/* バッジセクション */}
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <h3 className="font-bold text-gray-700 mb-3">
              🏅 バッジ ({earnedBadges.length}/{allBadgeDefs.length})
            </h3>

            {earnedBadges.length > 0 && (
              <>
                <p className="text-xs text-gray-500 mb-2">獲得済み</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {earnedBadges.map((def) => (
                    <div
                      key={def.id}
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                    >
                      <p className="font-semibold text-yellow-800 text-sm">
                        🏅 {def.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {def.description}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {unearnedBadges.length > 0 && (
              <>
                <p className="text-xs text-gray-500 mb-2">未獲得</p>
                <div className="grid grid-cols-2 gap-3">
                  {unearnedBadges.map((def) => (
                    <div
                      key={def.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                    >
                      <p className="font-semibold text-gray-400 text-sm">
                        🔒 {def.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        条件:{' '}
                        {badgeSystem.getConditionDescription(def.condition)}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {allBadgeDefs.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">
                バッジ情報を読み込み中...
              </p>
            )}
          </div>

          {/* 車両カード図鑑 */}
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <h3 className="font-bold text-gray-700 mb-3">
              🚋 車両カード図鑑 ({unlockedVehicleIds.size}/
              {allVehicleCards.length})
            </h3>

            {allVehicleCards.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                車両カード情報を読み込み中...
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {sortedVehicleCards.map((card) => {
                  const isUnlocked = unlockedVehicleIds.has(card.id);
                  return (
                    <div
                      key={card.id}
                      className={`border-2 rounded-lg p-3 ${
                        isUnlocked
                          ? RARITY_BORDER[card.rarity]
                          : 'border-gray-200'
                      } ${isUnlocked ? '' : 'opacity-50'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                            isUnlocked
                              ? RARITY_BADGE_COLOR[card.rarity]
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {RARITY_LABEL[card.rarity]}
                        </span>
                      </div>
                      {isUnlocked ? (
                        <>
                          <p className="font-semibold text-gray-800 text-sm">
                            {card.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {card.description}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-gray-400 text-sm">
                            ???
                          </p>
                          <p className="text-xs text-gray-300 mt-1">
                            クエストをクリアして獲得
                          </p>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* アンロック済み路線 */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-bold text-gray-700 mb-3">
              🗺️ アンロック済み路線 ({progress.unlockedLineIds.length})
            </h3>
            {progress.unlockedLineIds.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                路線をアンロックしましょう
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {progress.unlockedLineIds.map((lineId) => (
                  <span
                    key={lineId}
                    className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
                  >
                    {lineId.replace('line-', '')}
                  </span>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
