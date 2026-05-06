/**
 * PlayerDataRepositoryのユニットテスト
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PlayerDataRepository } from '../../../../src/repositories/PlayerDataRepository';
import type { PlayerProgress } from '../../../../src/types';

describe('PlayerDataRepository', () => {
  let repository: PlayerDataRepository;
  let sampleProgress: PlayerProgress;

  beforeEach(() => {
    repository = new PlayerDataRepository();
    localStorage.clear();

    sampleProgress = {
      playerId: 'test-player-id',
      currentLevel: 1,
      completedQuestIds: ['quest-sobu-01'],
      unlockedLineIds: ['line-sobu'],
      unlockedVehicleIds: [],
      badges: [],
      totalPoints: 100,
      dailyChallenge: {
        date: '2026-05-05',
        questId: '',
        completed: false,
        bonusPoints: 0,
      },
      statistics: {
        totalQuizzes: 5,
        correctQuizzes: 4,
        totalPuzzles: 2,
        completedPuzzles: 2,
        averagePlayTime: 15,
        consecutiveDays: 1,
      },
      createdAt: new Date(),
      lastPlayedAt: new Date(),
    };
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('save and load', () => {
    it('データを保存し、読み込める', () => {
      repository.save(sampleProgress);
      const loaded = repository.load();

      expect(loaded).not.toBeNull();
      expect(loaded?.playerId).toBe('test-player-id');
      expect(loaded?.currentLevel).toBe(1);
      expect(loaded?.completedQuestIds).toContain('quest-sobu-01');
    });

    it('データが存在しない場合、nullを返す', () => {
      const loaded = repository.load();

      expect(loaded).toBeNull();
    });
  });

  describe('exists', () => {
    it('データが保存されている場合、trueを返す', () => {
      repository.save(sampleProgress);

      expect(repository.exists()).toBe(true);
    });

    it('データが保存されていない場合、falseを返す', () => {
      expect(repository.exists()).toBe(false);
    });
  });

  describe('reset', () => {
    it('データをリセットする', () => {
      repository.save(sampleProgress);
      expect(repository.exists()).toBe(true);

      repository.reset();
      expect(repository.exists()).toBe(false);
    });
  });
});
