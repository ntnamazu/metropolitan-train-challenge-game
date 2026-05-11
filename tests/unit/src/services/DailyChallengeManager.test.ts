/**
 * DailyChallengeManagerのユニットテスト
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DailyChallengeManager } from '../../../../src/services/DailyChallengeManager';
import type { Quest, PlayerProgress } from '../../../../src/types';

const makeProgress = (
  overrides: Partial<PlayerProgress> = {}
): PlayerProgress => ({
  playerId: 'test-player',
  currentLevel: 1,
  completedQuestIds: [],
  unlockedLineIds: [],
  unlockedVehicleIds: [],
  badges: [],
  totalPoints: 0,
  dailyChallenge: {
    date: '2026-05-11',
    questId: '',
    completed: false,
    bonusPoints: 100,
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

const makeQuest = (id: string): Quest => ({
  id,
  title: `クエスト ${id}`,
  description: 'テスト用クエスト',
  level: 1,
  railwayLine: 'line-sobu',
  steps: [],
  rewards: [],
});

describe('DailyChallengeManager', () => {
  let manager: DailyChallengeManager;
  let quests: Quest[];

  beforeEach(() => {
    manager = new DailyChallengeManager();
    quests = [makeQuest('quest-a'), makeQuest('quest-b'), makeQuest('quest-c')];
  });

  describe('getDailyQuest', () => {
    it('同じ日付では常に同じクエストを返す', () => {
      const date = '2026-05-11';
      const first = manager.getDailyQuest(date, quests);
      const second = manager.getDailyQuest(date, quests);
      expect(first.id).toBe(second.id);
    });

    it('利用可能なクエスト一覧から選択する', () => {
      const date = '2026-05-11';
      const quest = manager.getDailyQuest(date, quests);
      expect(quests.some((q) => q.id === quest.id)).toBe(true);
    });

    it('空配列を渡した場合にエラーをスローする', () => {
      expect(() => manager.getDailyQuest('2026-05-11', [])).toThrow(
        '利用可能なクエストが存在しません'
      );
    });

    it('異なる日付では異なるクエストが返る場合がある', () => {
      const results = new Set<string>();
      for (let day = 1; day <= 10; day++) {
        const date = `2026-05-${String(day).padStart(2, '0')}`;
        results.add(manager.getDailyQuest(date, quests).id);
      }
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('checkCompletion', () => {
    it('今日の日付で完了済みなら true を返す', () => {
      const today = new Date().toISOString().split('T')[0];
      const progress = makeProgress({
        dailyChallenge: {
          date: today,
          questId: 'quest-a',
          completed: true,
          bonusPoints: 100,
        },
      });
      expect(manager.checkCompletion(progress)).toBe(true);
    });

    it('今日の日付で未完了なら false を返す', () => {
      const today = new Date().toISOString().split('T')[0];
      const progress = makeProgress({
        dailyChallenge: {
          date: today,
          questId: 'quest-a',
          completed: false,
          bonusPoints: 100,
        },
      });
      expect(manager.checkCompletion(progress)).toBe(false);
    });

    it('昨日の日付で完了済みでも false を返す', () => {
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split('T')[0];
      const progress = makeProgress({
        dailyChallenge: {
          date: yesterday,
          questId: 'quest-a',
          completed: true,
          bonusPoints: 100,
        },
      });
      expect(manager.checkCompletion(progress)).toBe(false);
    });
  });

  describe('markAsCompleted', () => {
    it('completed フラグを true にする', () => {
      const progress = makeProgress();
      manager.markAsCompleted(progress, 'quest-a');
      expect(progress.dailyChallenge.completed).toBe(true);
    });

    it('questId を設定する', () => {
      const progress = makeProgress();
      manager.markAsCompleted(progress, 'quest-a');
      expect(progress.dailyChallenge.questId).toBe('quest-a');
    });

    it('bonusPoints を 100 に設定する', () => {
      const progress = makeProgress();
      manager.markAsCompleted(progress, 'quest-a');
      expect(progress.dailyChallenge.bonusPoints).toBe(100);
    });

    it('date に今日の日付を設定する', () => {
      const today = new Date().toISOString().split('T')[0];
      const progress = makeProgress();
      manager.markAsCompleted(progress, 'quest-a');
      expect(progress.dailyChallenge.date).toBe(today);
    });
  });

  describe('awardBonusPoints', () => {
    it('totalPoints に bonusPoints を加算する', () => {
      const progress = makeProgress({
        totalPoints: 200,
        dailyChallenge: {
          date: '2026-05-11',
          questId: 'quest-a',
          completed: true,
          bonusPoints: 100,
        },
      });
      manager.awardBonusPoints(progress);
      expect(progress.totalPoints).toBe(300);
    });
  });

  describe('resetIfNeeded', () => {
    it('日付が変わっていたらリセットする', () => {
      const progress = makeProgress({
        dailyChallenge: {
          date: '2020-01-01',
          questId: 'quest-a',
          completed: true,
          bonusPoints: 100,
        },
      });
      manager.resetIfNeeded(progress);
      const today = new Date().toISOString().split('T')[0];
      expect(progress.dailyChallenge.date).toBe(today);
      expect(progress.dailyChallenge.completed).toBe(false);
      expect(progress.dailyChallenge.questId).toBe('');
    });

    it('同じ日付ならリセットしない', () => {
      const today = new Date().toISOString().split('T')[0];
      const progress = makeProgress({
        dailyChallenge: {
          date: today,
          questId: 'quest-a',
          completed: true,
          bonusPoints: 100,
        },
      });
      manager.resetIfNeeded(progress);
      expect(progress.dailyChallenge.completed).toBe(true);
      expect(progress.dailyChallenge.questId).toBe('quest-a');
    });
  });
});
