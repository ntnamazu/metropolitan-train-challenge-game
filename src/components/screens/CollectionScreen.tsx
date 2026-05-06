import { useUiStore, useProgressStore } from '../../stores';
import { Button } from '../common/Button';

export function CollectionScreen() {
  const navigate = useUiStore((s) => s.navigate);
  const progress = useProgressStore((s) => s.progress);

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

          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <h3 className="font-bold text-gray-700 mb-3">
              🏅 獲得バッジ ({progress.badges.length})
            </h3>
            {progress.badges.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                まだバッジを獲得していません
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {progress.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                  >
                    <p className="font-semibold text-yellow-800 text-sm">
                      {badge.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {badge.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-bold text-gray-700 mb-3">
              🚋 アンロック済み路線 ({progress.unlockedLineIds.length})
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
