import { useEffect, useState } from 'react';
import { useUiStore, useProgressStore, useQuestStore } from '../../stores';
import { QuizContainer } from '../quiz/QuizContainer';
import { PuzzleContainer } from '../puzzle/PuzzleContainer';
import { Button } from '../common/Button';
import { quizRepo, puzzleRepo } from '../../services/instances';
import type {
  QuizResult,
  PuzzleData,
  RailwayMap,
  Quest,
  QuizQuestion,
} from '../../types';

type Phase = 'loading' | 'quiz' | 'puzzle' | 'challenge' | 'error';

function RewardModal({
  rewards,
  onClose,
}: {
  rewards: Quest['rewards'];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          クエストクリア！
        </h2>
        <p className="text-gray-500 mb-4">報酬を獲得しました</p>
        <div className="flex flex-col gap-2 mb-5">
          {rewards.map((r) => (
            <div
              key={r.id}
              className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2"
            >
              <span className="font-semibold text-yellow-800">
                {r.type === 'points' ? '⭐' : r.type === 'badge' ? '🏅' : '🚋'}{' '}
                {r.name}
              </span>
            </div>
          ))}
        </div>
        <Button onClick={onClose} className="w-full py-3">
          クエスト一覧へ戻る
        </Button>
      </div>
    </div>
  );
}

export function QuestPlayScreen() {
  const navigate = useUiStore((s) => s.navigate);
  const completeQuestProgress = useProgressStore((s) => s.completeQuest);
  const { selectedQuest, startQuest, completeCurrentStep, completeQuest } =
    useQuestStore();

  const [phase, setPhase] = useState<Phase>('loading');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null);
  const [railwayMap, setRailwayMap] = useState<RailwayMap | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);

  useEffect(() => {
    if (!selectedQuest) {
      navigate('quest-list');
      return;
    }
    initQuest(selectedQuest);
  }, [selectedQuest]);

  const initQuest = async (quest: Quest) => {
    try {
      await startQuest();
      const questions = await quizRepo.loadQuizzesByQuestId(quest.id);
      setQuizQuestions(questions);
      setPhase('quiz');
    } catch {
      setPhase('error');
    }
  };

  const handleQuizComplete = (results: QuizResult[]) => {
    setQuizResults(results);
    const correctCount = results.filter((r) => r.correct).length;
    const score =
      results.length > 0
        ? Math.round((correctCount / results.length) * 100)
        : 0;
    completeCurrentStep(correctCount === results.length, score);
    loadPuzzle();
  };

  const loadPuzzle = async () => {
    if (!selectedQuest) return;
    setPhase('loading');
    try {
      const pd = await puzzleRepo.loadPuzzleByQuestId(selectedQuest.id);
      setPuzzleData(pd);
      setRailwayMap(pd.railwayMap);
      setPhase('puzzle');
    } catch {
      setPhase('challenge');
    }
  };

  const handlePuzzleComplete = (success: boolean, _selectedPath: string[]) => {
    completeCurrentStep(success, success ? 80 : 20);
    setPhase('challenge');
  };

  const handleChallengeComplete = async () => {
    completeCurrentStep(true, 100);
    if (!selectedQuest) return;
    try {
      await completeQuest();
      completeQuestProgress(selectedQuest.id, selectedQuest.rewards);
      setShowRewardModal(true);
    } catch {
      navigate('quest-list');
    }
  };

  if (!selectedQuest) return null;

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Button onClick={() => navigate('quest-list')} variant="secondary">
          ← 中断
        </Button>
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {selectedQuest.title}
          </h2>
          <div className="flex gap-2 mt-1">
            {['クイズ', 'パズル', 'チャレンジ'].map((step, i) => {
              const isCurrent =
                (i === 0 && phase === 'quiz') ||
                (i === 1 && phase === 'puzzle') ||
                (i === 2 && phase === 'challenge');
              const isDone =
                (i === 0 && (phase === 'puzzle' || phase === 'challenge')) ||
                (i === 1 && phase === 'challenge');
              return (
                <span
                  key={step}
                  className={`text-xs px-2 py-0.5 rounded-full ${isDone ? 'bg-green-100 text-green-700' : isCurrent ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-400'}`}
                >
                  {isDone ? '✓ ' : ''}
                  {step}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {phase === 'loading' && (
        <div className="text-center py-12 text-gray-500">読み込み中...</div>
      )}

      {phase === 'quiz' && (
        <QuizContainer
          questions={quizQuestions}
          onComplete={handleQuizComplete}
        />
      )}

      {phase === 'puzzle' && puzzleData && railwayMap && (
        <PuzzleContainer
          puzzleData={puzzleData}
          railwayMap={railwayMap}
          onComplete={handlePuzzleComplete}
        />
      )}

      {phase === 'challenge' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">チャレンジ</h3>
          <p className="text-gray-600 mb-4">
            クイズ正解数: {quizResults.filter((r) => r.correct).length} /{' '}
            {quizResults.length}
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-5">
            <p className="text-yellow-800 font-semibold">
              🌟 よくできました！クエストをクリアしましょう。
            </p>
          </div>
          <Button onClick={handleChallengeComplete} className="w-full py-3">
            クエストをクリア！
          </Button>
        </div>
      )}

      {phase === 'error' && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">エラーが発生しました</p>
          <Button onClick={() => navigate('quest-list')} variant="secondary">
            戻る
          </Button>
        </div>
      )}

      {showRewardModal && (
        <RewardModal
          rewards={selectedQuest.rewards}
          onClose={() => navigate('quest-list')}
        />
      )}
    </div>
  );
}
