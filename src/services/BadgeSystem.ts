/**
 * 実績バッジシステム
 */

import type { Badge, PlayerProgress } from '../types';
import { NotFoundError } from '../types';

/**
 * バッジ獲得条件
 */
export interface BadgeCondition {
  type:
    | 'complete_quest'
    | 'complete_line'
    | 'quiz_streak'
    | 'play_days'
    | 'total_correct_quizzes'
    | 'quest_count';
  requirement: string | string[] | number;
}

/**
 * バッジ定義
 */
export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  condition: BadgeCondition;
}

export class BadgeSystem {
  private badgeDefinitions: BadgeDefinition[];

  constructor(initialDefinitions?: BadgeDefinition[]) {
    this.badgeDefinitions = initialDefinitions ?? [];
  }

  async loadBadgeDefinitions(): Promise<void> {
    try {
      const response = await fetch('/data/badges.json');
      if (!response.ok) {
        throw new NotFoundError('BadgeDefinitions', 'badges');
      }
      this.badgeDefinitions = (await response.json()) as BadgeDefinition[];
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new NotFoundError('BadgeDefinitions', 'unknown');
    }
  }

  /**
   * バッジ獲得条件を判定し、新たに獲得できるバッジを返す
   */
  checkBadgeConditions(progress: PlayerProgress): Badge[] {
    const newBadges: Badge[] = [];

    for (const definition of this.badgeDefinitions) {
      if (progress.badges.some((b) => b.id === definition.id)) {
        continue;
      }

      if (this.meetsCondition(progress, definition.condition)) {
        const badge: Badge = {
          id: definition.id,
          name: definition.name,
          description: definition.description,
          earnedAt: new Date(),
        };
        newBadges.push(badge);
      }
    }

    return newBadges;
  }

  private meetsCondition(
    progress: PlayerProgress,
    condition: BadgeCondition
  ): boolean {
    switch (condition.type) {
      case 'complete_quest':
        return progress.completedQuestIds.includes(
          condition.requirement as string
        );

      case 'complete_line':
        return (condition.requirement as string[]).every((questId) =>
          progress.completedQuestIds.includes(questId)
        );

      case 'total_correct_quizzes':
        return (
          progress.statistics.correctQuizzes >=
          (condition.requirement as number)
        );

      case 'quest_count':
        return (
          progress.completedQuestIds.length >= (condition.requirement as number)
        );

      case 'play_days':
        return (
          progress.statistics.consecutiveDays >=
          (condition.requirement as number)
        );

      case 'quiz_streak':
        // TODO: クイズ連続正解トラッキングを実装 (statistics に streak フィールドの追加が必要)
        return false;

      default:
        return false;
    }
  }

  /**
   * バッジIDからバッジ定義を取得
   */
  getBadgeById(badgeId: string): BadgeDefinition {
    const definition = this.badgeDefinitions.find((b) => b.id === badgeId);

    if (!definition) {
      throw new NotFoundError('BadgeDefinition', badgeId);
    }

    return definition;
  }

  /**
   * アンロック済みバッジを取得
   */
  getUnlockedBadges(progress: PlayerProgress): Badge[] {
    return progress.badges;
  }

  /**
   * 全バッジ定義を返す (CollectionScreen の未獲得バッジ表示用)
   */
  getAllBadgeDefinitions(): BadgeDefinition[] {
    return this.badgeDefinitions;
  }

  /**
   * 条件の説明文を生成 (UI 表示用)
   */
  getConditionDescription(condition: BadgeCondition): string {
    switch (condition.type) {
      case 'complete_quest':
        return `クエスト「${condition.requirement}」をクリア`;

      case 'complete_line':
        return `指定された路線のクエストをすべてクリア`;

      case 'total_correct_quizzes':
        return `クイズに${condition.requirement}問以上正解`;

      case 'quest_count':
        return `クエストを${condition.requirement}個以上クリア`;

      case 'play_days':
        return `${condition.requirement}日間連続でプレイ`;

      case 'quiz_streak':
        return `クイズを連続正解`;

      default:
        return '条件を達成';
    }
  }
}
