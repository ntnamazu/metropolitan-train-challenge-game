import { useEffect, useState } from 'react';
import type {
  QuizQuestion,
  QuizResult,
  RailwayLine,
  RailwayPhoto,
} from '../../types';
import { Button } from '../common/Button';
import { RailwayLinePhoto } from '../common/RailwayLinePhoto';

interface QuizContainerProps {
  questions: QuizQuestion[];
  onComplete: (results: QuizResult[]) => void;
  railwayLine?: RailwayLine;
}

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function QuizContainer({
  questions,
  onComplete,
  railwayLine,
}: QuizContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [readyToComplete, setReadyToComplete] = useState(false);
  const [quizPhoto, setQuizPhoto] = useState<RailwayPhoto | undefined>(
    undefined
  );
  const [feedbackPhoto, setFeedbackPhoto] = useState<RailwayPhoto | undefined>(
    undefined
  );

  const question = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  useEffect(() => {
    if (!railwayLine) return;
    setQuizPhoto(pickRandom(railwayLine.quizPhotos));
    setFeedbackPhoto(undefined);
  }, [currentIndex, railwayLine]);

  useEffect(() => {
    if (!answered || !railwayLine) return;
    const pool =
      railwayLine.feedbackPhotos.length > 0
        ? railwayLine.feedbackPhotos
        : railwayLine.quizPhotos;
    setFeedbackPhoto(pickRandom(pool));
  }, [answered, railwayLine]);

  useEffect(() => {
    if (readyToComplete && results.length === questions.length) {
      onComplete(results);
    }
  }, [readyToComplete, results, questions.length, onComplete]);

  if (!question) {
    return (
      <div className="text-center py-8 text-gray-500">
        クイズデータがありません
      </div>
    );
  }

  const handleAnswer = (index: number) => {
    if (answered) return;
    const result: QuizResult = {
      correct: index === question.correctIndex,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
    };
    setSelectedIndex(index);
    setAnswered(true);
    setLastResult(result);
    setResults((prev) => [...prev, result]);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setReadyToComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedIndex(null);
      setAnswered(false);
      setLastResult(null);
    }
  };

  const choiceColors = (index: number) => {
    if (!answered) return 'bg-white hover:bg-blue-50 border-gray-200';
    if (index === question.correctIndex)
      return 'bg-green-100 border-green-500 text-green-800';
    if (index === selectedIndex)
      return 'bg-red-100 border-red-400 text-red-800';
    return 'bg-white border-gray-200 opacity-60';
  };

  const displayPhoto = answered ? (feedbackPhoto ?? quizPhoto) : quizPhoto;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between text-sm text-gray-500">
        <span>
          問題 {currentIndex + 1} / {questions.length}
        </span>
        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
          クイズ
        </span>
      </div>

      {displayPhoto && <RailwayLinePhoto photo={displayPhoto} />}

      <div className="bg-white rounded-xl p-5 shadow">
        <p className="text-lg font-semibold text-gray-800 mb-5">
          {question.question}
        </p>
        <div className="flex flex-col gap-3">
          {question.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={answered}
              className={`text-left px-4 py-3 rounded-lg border-2 font-medium transition-colors ${choiceColors(i)} ${answered ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className="text-gray-400 mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {choice}
            </button>
          ))}
        </div>
      </div>

      {answered && lastResult && (
        <div
          className={`rounded-xl p-4 ${lastResult.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
        >
          <p className="font-semibold mb-1">
            {lastResult.correct ? '✅ 正解！' : '❌ 不正解...'}
          </p>
          <p className="text-sm text-gray-700">{question.explanation}</p>
        </div>
      )}

      {answered && (
        <Button onClick={handleNext} className="w-full py-3">
          {isLastQuestion ? 'パズルへ進む →' : '次の問題 →'}
        </Button>
      )}
    </div>
  );
}
