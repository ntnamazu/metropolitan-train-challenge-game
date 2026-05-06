/**
 * クイズエンジン
 */

import type { QuizQuestion, QuizResult, QuestStep } from '../types';
import { ValidationError } from '../types';
import type { QuizDataRepository } from '../repositories/QuizDataRepository';

export class QuizEngine {
  constructor(private _quizDataRepository: QuizDataRepository) {}

  /**
   * クエストステップからクイズ問題を読み込む
   */
  loadQuestions(questStep: QuestStep): QuizQuestion[] {
    if (questStep.type !== 'quiz') {
      throw new ValidationError(
        'このステップはクイズではありません',
        'questStep.type',
        questStep.type
      );
    }

    return questStep.content as QuizQuestion[];
  }

  /**
   * 回答を採点する
   */
  submitAnswer(question: QuizQuestion, selectedIndex: number): QuizResult {
    // 選択肢のインデックスバリデーション (0-3)
    if (selectedIndex < 0 || selectedIndex > 3) {
      throw new ValidationError(
        'クイズの選択肢は0-3の範囲で指定してください',
        'selectedIndex',
        selectedIndex
      );
    }

    const correct = selectedIndex === question.correctIndex;

    return {
      correct,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
    };
  }
}
