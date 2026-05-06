/**
 * QuizEngineのユニットテスト
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { QuizEngine } from '../../../../src/services/QuizEngine';
import type { QuizQuestion, QuestStep } from '../../../../src/types';

describe('QuizEngine', () => {
  let quizEngine: QuizEngine;
  let sampleQuestion: QuizQuestion;

  beforeEach(() => {
    quizEngine = new QuizEngine({} as any); // QuizDataRepositoryはモック
    sampleQuestion = {
      id: 'q1',
      category: 'station_name',
      question: '三鷹の次の駅は？',
      choices: ['吉祥寺', '西荻窪', '荻窪', '中野'],
      correctIndex: 0,
      explanation: '三鷹の次は吉祥寺です',
      difficulty: 1,
    };
  });

  describe('submitAnswer', () => {
    it('正解の選択肢を選んだ場合、correctがtrueを返す', () => {
      const result = quizEngine.submitAnswer(sampleQuestion, 0);

      expect(result.correct).toBe(true);
      expect(result.correctIndex).toBe(0);
      expect(result.explanation).toBe('三鷹の次は吉祥寺です');
    });

    it('不正解の選択肢を選んだ場合、correctがfalseを返す', () => {
      const result = quizEngine.submitAnswer(sampleQuestion, 1);

      expect(result.correct).toBe(false);
      expect(result.correctIndex).toBe(0);
    });

    it('無効な選択肢インデックス（-1）でValidationErrorをスロー', () => {
      expect(() => {
        quizEngine.submitAnswer(sampleQuestion, -1);
      }).toThrow('クイズの選択肢は0-3の範囲で指定してください');
    });

    it('無効な選択肢インデックス（4）でValidationErrorをスロー', () => {
      expect(() => {
        quizEngine.submitAnswer(sampleQuestion, 4);
      }).toThrow('クイズの選択肢は0-3の範囲で指定してください');
    });
  });

  describe('loadQuestions', () => {
    it('クイズステップからクイズ問題を読み込む', () => {
      const questStep: QuestStep = {
        type: 'quiz',
        content: [sampleQuestion],
      };

      const questions = quizEngine.loadQuestions(questStep);

      expect(questions).toHaveLength(1);
      expect(questions[0]).toEqual(sampleQuestion);
    });

    it('クイズ以外のステップでValidationErrorをスロー', () => {
      const questStep: QuestStep = {
        type: 'puzzle',
        content: {} as any,
      };

      expect(() => {
        quizEngine.loadQuestions(questStep);
      }).toThrow('このステップはクイズではありません');
    });
  });
});
