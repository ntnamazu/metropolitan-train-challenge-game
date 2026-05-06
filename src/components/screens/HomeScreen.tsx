import { useUiStore, useProgressStore } from '../../stores';
import { Button } from '../common/Button';

export function HomeScreen() {
  const navigate = useUiStore((s) => s.navigate);
  const progress = useProgressStore((s) => s.progress);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🚆</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          首都圏鉄道マスター
        </h1>
        <p className="text-gray-500 mb-6">楽しく学べる鉄道知識ゲーム</p>

        {progress && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-blue-700 mb-2">
              あなたの進捗
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  Lv.{progress.currentLevel}
                </p>
                <p className="text-xs text-gray-500">レベル</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {progress.completedQuestIds.length}
                </p>
                <p className="text-xs text-gray-500">クリア数</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {progress.totalPoints}
                </p>
                <p className="text-xs text-gray-500">ポイント</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate('quest-list')}
            className="w-full py-3 text-lg"
          >
            🎯 クエストを始める
          </Button>
          <Button
            onClick={() => navigate('daily-challenge')}
            variant="secondary"
            className="w-full py-2"
          >
            📅 デイリーチャレンジ
          </Button>
          <Button
            onClick={() => navigate('collection')}
            variant="secondary"
            className="w-full py-2"
          >
            🏆 コレクション
          </Button>
        </div>
      </div>
    </div>
  );
}
