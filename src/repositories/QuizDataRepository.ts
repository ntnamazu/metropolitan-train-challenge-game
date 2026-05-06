/**
 * クイズデータリポジトリ
 */

import type { QuizQuestion } from '../types';
import { NotFoundError } from '../types';
import type { RailwayDataRepository } from './RailwayDataRepository';

export class QuizDataRepository {
  constructor(private _railwayDataRepository: RailwayDataRepository) {}

  /**
   * クエストIDに紐づくクイズ問題を読み込む
   */
  async loadQuizzesByQuestId(questId: string): Promise<QuizQuestion[]> {
    try {
      // クエストIDから路線名を抽出 (例: "quest-sobu-01" → "sobu")
      const match = questId.match(/quest-(.+)-\d+/);
      if (!match) {
        throw new NotFoundError('QuizData', questId);
      }

      const lineName = match[1];
      const response = await fetch(
        `/data/quizzes/level1/${lineName}-quiz.json`
      );

      if (!response.ok) {
        throw new NotFoundError('QuizData', questId);
      }

      const quizzes = (await response.json()) as QuizQuestion[];
      return quizzes;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new NotFoundError('QuizData', questId);
    }
  }
}
