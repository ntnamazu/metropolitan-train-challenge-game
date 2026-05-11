import { useEffect, useState } from 'react';
import { useUiStore, useProgressStore, useQuestStore } from '../../stores';
import { Button } from '../common/Button';
import { dailyChallengeManager } from '../../services/instances';
import type { Quest } from '../../types';

export function DailyChallengeScreen() {
  const navigate = useUiStore((s) => s.navigate);
  const progress = useProgressStore((s) => s.progress);
  const updateProgress = useProgressStore((s) => s.updateProgress);
  const { availableQuests, loadAvailableQuests, selectQuest } = useQuestStore();
  const [dailyQuest, setDailyQuest] = useState<Quest | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    loadAvailableQuests();
  }, [loadAvailableQuests]);

  useEffect(() => {
    if (availableQuests.length === 0 || !progress) return;
    const today = new Date().toISOString().split('T')[0];
    const quest = dailyChallengeManager.getDailyQuest(today, availableQuests);
    setDailyQuest(quest);
    setIsCompleted(dailyChallengeManager.checkCompletion(progress));
  }, [availableQuests, progress]);

  const handleStart = () => {
    if (!dailyQuest || !progress) return;

    const updated = { ...progress };
    dailyChallengeManager.resetIfNeeded(updated);
    updated.dailyChallenge = {
      ...updated.dailyChallenge,
      questId: dailyQuest.id,
    };
    updateProgress(updated);

    selectQuest(dailyQuest);
    navigate('quest-play');
  };

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button onClick={() => navigate('home')} variant="secondary">
          ← 戻る
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">デイリーチャレンジ</h2>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">📅</div>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('ja-JP')}
          </p>
        </div>

        {isCompleted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <p className="text-3xl mb-2">✅</p>
            <p className="font-bold text-green-700 text-lg">
              本日のチャレンジ完了！
            </p>
            <p className="text-sm text-gray-500 mt-2">
              明日のチャレンジをお楽しみに
            </p>
          </div>
        ) : dailyQuest ? (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <h3 className="font-bold text-blue-800 mb-1">
                {dailyQuest.title}
              </h3>
              <p className="text-sm text-gray-600">{dailyQuest.description}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 mb-4 text-sm">
              <p className="font-semibold text-yellow-800">
                🎁 クリア報酬: +100ポイント
              </p>
            </div>
            <Button onClick={handleStart} className="w-full py-3 text-lg">
              チャレンジ開始！
            </Button>
          </div>
        ) : (
          <p className="text-center text-gray-400 py-6">読み込み中...</p>
        )}
      </div>
    </div>
  );
}
