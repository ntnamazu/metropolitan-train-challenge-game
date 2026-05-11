/**
 * BadgeSystemのユニットテスト
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BadgeSystem } from '../../../../src/services/BadgeSystem';
import type { PlayerProgress } from '../../../../src/types';

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

describe('BadgeSystem', () => {
  let badgeSystem: BadgeSystem;

  const testDefinitions = [
    {
      id: 'badge-sobu-master',
      name: '総武線マスター',
      description: '中央・総武線のすべてのクエストをクリア',
      condition: {
        type: 'complete_line' as const,
        requirement: ['quest-sobu-01', 'quest-sobu-02'],
      },
    },
    {
      id: 'badge-quiz-master',
      name: 'クイズ名人',
      description: 'クイズに5問以上正解',
      condition: {
        type: 'total_correct_quizzes' as const,
        requirement: 5,
      },
    },
    {
      id: 'badge-collector',
      name: 'コレクター',
      description: 'クエストを3個以上クリア',
      condition: {
        type: 'quest_count' as const,
        requirement: 3,
      },
    },
    {
      id: 'badge-persistence',
      name: '継続は力なり',
      description: '3日間連続でプレイ',
      condition: {
        type: 'play_days' as const,
        requirement: 3,
      },
    },
  ];

  beforeEach(() => {
    badgeSystem = new BadgeSystem(testDefinitions);
  });

  describe('checkBadgeConditions - complete_line', () => {
    it('全クエストID完了時に true を返す', () => {
      const progress = makeProgress({
        completedQuestIds: ['quest-sobu-01', 'quest-sobu-02'],
      });

      const newBadges = badgeSystem.checkBadgeConditions(progress);

      expect(newBadges.some((b) => b.id === 'badge-sobu-master')).toBe(true);
    });

    it('一部未完了時に false を返す', () => {
      const progress = makeProgress({
        completedQuestIds: ['quest-sobu-01'],
      });

      const newBadges = badgeSystem.checkBadgeConditions(progress);

      expect(newBadges.some((b) => b.id === 'badge-sobu-master')).toBe(false);
    });

    it('既に獲得済みのバッジはスキップされる', () => {
      const progress = makeProgress({
        completedQuestIds: ['quest-sobu-01', 'quest-sobu-02'],
        badges: [
          {
            id: 'badge-sobu-master',
            name: '総武線マスター',
            description: '',
            earnedAt: new Date(),
          },
        ],
      });

      const newBadges = badgeSystem.checkBadgeConditions(progress);

      expect(newBadges.some((b) => b.id === 'badge-sobu-master')).toBe(false);
    });
  });

  describe('checkBadgeConditions - total_correct_quizzes', () => {
    it('正解数が条件以上で true を返す', () => {
      const progress = makeProgress({
        statistics: {
          totalQuizzes: 10,
          correctQuizzes: 5,
          totalPuzzles: 0,
          completedPuzzles: 0,
          averagePlayTime: 0,
          consecutiveDays: 0,
        },
      });

      const newBadges = badgeSystem.checkBadgeConditions(progress);

      expect(newBadges.some((b) => b.id === 'badge-quiz-master')).toBe(true);
    });

    it('正解数が条件未満で false を返す', () => {
      const progress = makeProgress({
        statistics: {
          totalQuizzes: 4,
          correctQuizzes: 4,
          totalPuzzles: 0,
          completedPuzzles: 0,
          averagePlayTime: 0,
          consecutiveDays: 0,
        },
      });

      const newBadges = badgeSystem.checkBadgeConditions(progress);

      expect(newBadges.some((b) => b.id === 'badge-quiz-master')).toBe(false);
    });
  });

  describe('checkBadgeConditions - quest_count', () => {
    it('クエスト数が条件以上で true を返す', () => {
      const progress = makeProgress({
        completedQuestIds: ['q1', 'q2', 'q3'],
      });

      const newBadges = badgeSystem.checkBadgeConditions(progress);

      expect(newBadges.some((b) => b.id === 'badge-collector')).toBe(true);
    });

    it('クエスト数が条件未満で false を返す', () => {
      const progress = makeProgress({
        completedQuestIds: ['q1', 'q2'],
      });

      const newBadges = badgeSystem.checkBadgeConditions(progress);

      expect(newBadges.some((b) => b.id === 'badge-collector')).toBe(false);
    });
  });

  describe('checkBadgeConditions - play_days', () => {
    it('連続プレイ日数が条件以上で true を返す', () => {
      const progress = makeProgress({
        statistics: {
          totalQuizzes: 0,
          correctQuizzes: 0,
          totalPuzzles: 0,
          completedPuzzles: 0,
          averagePlayTime: 0,
          consecutiveDays: 3,
        },
      });

      const newBadges = badgeSystem.checkBadgeConditions(progress);

      expect(newBadges.some((b) => b.id === 'badge-persistence')).toBe(true);
    });

    it('連続プレイ日数が条件未満で false を返す', () => {
      const progress = makeProgress({
        statistics: {
          totalQuizzes: 0,
          correctQuizzes: 0,
          totalPuzzles: 0,
          completedPuzzles: 0,
          averagePlayTime: 0,
          consecutiveDays: 2,
        },
      });

      const newBadges = badgeSystem.checkBadgeConditions(progress);

      expect(newBadges.some((b) => b.id === 'badge-persistence')).toBe(false);
    });
  });

  describe('getConditionDescription', () => {
    it('complete_line の説明文を返す', () => {
      const desc = badgeSystem.getConditionDescription({
        type: 'complete_line',
        requirement: ['quest-sobu-01'],
      });
      expect(desc).toBe('指定された路線のクエストをすべてクリア');
    });

    it('total_correct_quizzes の説明文を返す', () => {
      const desc = badgeSystem.getConditionDescription({
        type: 'total_correct_quizzes',
        requirement: 5,
      });
      expect(desc).toBe('クイズに5問以上正解');
    });

    it('quest_count の説明文を返す', () => {
      const desc = badgeSystem.getConditionDescription({
        type: 'quest_count',
        requirement: 3,
      });
      expect(desc).toBe('クエストを3個以上クリア');
    });

    it('play_days の説明文を返す', () => {
      const desc = badgeSystem.getConditionDescription({
        type: 'play_days',
        requirement: 3,
      });
      expect(desc).toBe('3日間連続でプレイ');
    });
  });

  describe('getAllBadgeDefinitions', () => {
    it('全バッジ定義を返す', () => {
      const defs = badgeSystem.getAllBadgeDefinitions();
      expect(defs).toHaveLength(4);
    });
  });
});
