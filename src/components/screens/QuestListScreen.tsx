import { useEffect } from 'react';
import { useUiStore, useProgressStore, useQuestStore } from '../../stores';
import { Button } from '../common/Button';
import type { Quest } from '../../types';

function QuestCard({
  quest,
  isCompleted,
  onSelect,
}: {
  quest: Quest;
  isCompleted: boolean;
  onSelect: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 border-2 border-transparent hover:border-blue-300 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-800">{quest.title}</h3>
        {isCompleted && (
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
            ✓ 完了
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-3">{quest.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
          Lv.{quest.level}
        </span>
        <Button
          onClick={onSelect}
          variant={isCompleted ? 'secondary' : 'primary'}
        >
          {isCompleted ? 'もう一度' : '挑戦する'}
        </Button>
      </div>
    </div>
  );
}

export function QuestListScreen() {
  const navigate = useUiStore((s) => s.navigate);
  const progress = useProgressStore((s) => s.progress);
  const { availableQuests, isLoadingQuests, loadAvailableQuests, selectQuest } =
    useQuestStore();
  const currentLevel = progress?.currentLevel ?? 1;

  useEffect(() => {
    loadAvailableQuests(currentLevel);
  }, [loadAvailableQuests, currentLevel]);

  const handleSelectQuest = (quest: Quest) => {
    selectQuest(quest);
    navigate('quest-play');
  };

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button onClick={() => navigate('home')} variant="secondary">
          ← 戻る
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">クエスト一覧</h2>
      </div>

      {isLoadingQuests ? (
        <div className="text-center py-12 text-gray-500">読み込み中...</div>
      ) : availableQuests.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          クエストが見つかりません
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {availableQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              isCompleted={
                progress?.completedQuestIds.includes(quest.id) ?? false
              }
              onSelect={() => handleSelectQuest(quest)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
