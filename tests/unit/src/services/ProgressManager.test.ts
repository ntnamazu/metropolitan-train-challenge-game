/**
 * ProgressManagerのユニットテスト
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ProgressManager } from '../../../../src/services/ProgressManager';
import type { PlayerProgress } from '../../../../src/types';

const baseProgress = (
  overrides: Partial<PlayerProgress> = {}
): PlayerProgress => ({
  playerId: 'test',
  currentLevel: 1,
  completedQuestIds: [],
  unlockedLineIds: [],
  unlockedVehicleIds: [],
  badges: [],
  totalPoints: 0,
  dailyChallenge: {
    date: '2026-05-05',
    questId: '',
    completed: false,
    bonusPoints: 0,
  },
  statistics: {
    totalQuizzes: 0,
    correctQuizzes: 0,
    totalPuzzles: 0,
    completedPuzzles: 0,
    averagePlayTime: 0,
    consecutiveDays: 0,
  },
  createdAt: new Date(),
  lastPlayedAt: new Date(),
  ...overrides,
});

describe('ProgressManager', () => {
  let progressManager: ProgressManager;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      load: () => null,
      save: () => {},
      exists: () => false,
      reset: () => {},
    };
    progressManager = new ProgressManager(mockRepository);
  });

  describe('checkLevelUp', () => {
    it('後方互換: completedQuestsByLevel なしでレベル1に3クエストあればレベル2を返す', () => {
      const progress = baseProgress({
        completedQuestIds: [
          'quest-sobu-01',
          'quest-sobu-02',
          'quest-tobu-kamedo-01',
        ],
      });

      expect(progressManager.checkLevelUp(progress)).toBe(2);
    });

    it('後方互換: completedQuestsByLevel なしでレベル1に2クエストではnullを返す', () => {
      const progress = baseProgress({
        completedQuestIds: ['quest-sobu-01', 'quest-sobu-02'],
      });

      expect(progressManager.checkLevelUp(progress)).toBeNull();
    });

    it('completedQuestsByLevel ありでレベル1に3クエストあればレベル2を返す', () => {
      const progress = baseProgress({
        completedQuestIds: [
          'quest-sobu-01',
          'quest-sobu-02',
          'quest-tobu-kamedo-01',
        ],
        completedQuestsByLevel: {
          1: ['quest-sobu-01', 'quest-sobu-02', 'quest-tobu-kamedo-01'],
        },
      });

      expect(progressManager.checkLevelUp(progress)).toBe(2);
    });

    it('completedQuestsByLevel が空オブジェクトのとき後方互換パスで正常動作する', () => {
      const progress = baseProgress({
        completedQuestIds: ['quest-sobu-01', 'quest-sobu-02'],
        completedQuestsByLevel: {},
      });

      // level1 は 2 クエストのみ → レベルアップ条件(3つ)を満たさない
      expect(progressManager.checkLevelUp(progress)).toBeNull();
    });

    it('completedQuestsByLevel ありでレベル2クエストがレベル1カウントに混入しない', () => {
      const progress = baseProgress({
        completedQuestIds: [
          'quest-sobu-01',
          'quest-sobu-02',
          'quest-yamanote-01',
        ],
        completedQuestsByLevel: {
          1: ['quest-sobu-01', 'quest-sobu-02'],
          2: ['quest-yamanote-01'],
        },
      });

      // level1 は 2 クエストのみ → レベルアップ条件(3つ)を満たさない
      expect(progressManager.checkLevelUp(progress)).toBeNull();
    });

    it('completedQuestsByLevel ありでレベル2に5クエストあればレベル3を返す', () => {
      const progress = baseProgress({
        currentLevel: 2,
        completedQuestIds: [
          'quest-yamanote-01',
          'quest-chuo-01',
          'quest-chuo-02',
          'quest-chuo-03',
          'quest-chuo-04',
        ],
        completedQuestsByLevel: {
          2: [
            'quest-yamanote-01',
            'quest-chuo-01',
            'quest-chuo-02',
            'quest-chuo-03',
            'quest-chuo-04',
          ],
        },
      });

      expect(progressManager.checkLevelUp(progress)).toBe(3);
    });
  });

  describe('createInitialProgress', () => {
    it('初期プレイヤー進捗を作成', () => {
      const progress = progressManager.createInitialProgress();

      expect(progress.playerId).toBeDefined();
      expect(progress.currentLevel).toBe(1);
      expect(progress.completedQuestIds).toEqual([]);
      expect(progress.completedQuestsByLevel).toEqual({});
      expect(progress.unlockedLineIds).toContain('line-sobu');
      expect(progress.unlockedLineIds).toContain('line-tobu-kamedo');
    });
  });
});
