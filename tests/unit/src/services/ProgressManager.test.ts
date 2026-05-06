/**
 * ProgressManagerのユニットテスト
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ProgressManager } from '../../../../src/services/ProgressManager';
import type { PlayerProgress } from '../../../../src/types';

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
    it('レベル1で3クエストクリア時にレベル2を返す', () => {
      const progress: PlayerProgress = {
        playerId: 'test',
        currentLevel: 1,
        completedQuestIds: [
          'quest-sobu-01',
          'quest-sobu-02',
          'quest-tobu-kamedo-01',
        ],
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
      };

      const newLevel = progressManager.checkLevelUp(progress);

      expect(newLevel).toBe(2);
    });

    it('レベル1で2クエストクリア時にnullを返す', () => {
      const progress: PlayerProgress = {
        playerId: 'test',
        currentLevel: 1,
        completedQuestIds: ['quest-sobu-01', 'quest-sobu-02'],
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
      };

      const newLevel = progressManager.checkLevelUp(progress);

      expect(newLevel).toBeNull();
    });
  });

  describe('createInitialProgress', () => {
    it('初期プレイヤー進捗を作成', () => {
      const progress = progressManager.createInitialProgress();

      expect(progress.playerId).toBeDefined();
      expect(progress.currentLevel).toBe(1);
      expect(progress.completedQuestIds).toEqual([]);
      expect(progress.unlockedLineIds).toContain('line-sobu');
      expect(progress.unlockedLineIds).toContain('line-tobu-kamedo');
    });
  });
});
