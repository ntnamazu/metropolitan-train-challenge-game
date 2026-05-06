/**
 * 実績バッジシステム
 */

import type { Badge, PlayerProgress } from '../types';
import { NotFoundError } from '../types';

/**
 * バッジ定義
 */
interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  condition: BadgeCondition;
}

/**
 * バッジ獲得条件
 */
interface BadgeCondition {
  type: 'complete_quest' | 'complete_line' | 'quiz_streak' | 'play_days';
  requirement: any;
}

export class BadgeSystem {
  private badgeDefinitions: BadgeDefinition[] = [];

  /**
   * バッジ定義を読み込む
   */
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
   * バッジ獲得条件を判定
   */
  checkBadgeConditions(progress: PlayerProgress): Badge[] {
    const newBadges: Badge[] = [];

    for (const definition of this.badgeDefinitions) {
      // すでに獲得済みのバッジはスキップ
      if (progress.badges.some((b) => b.id === definition.id)) {
        continue;
      }

      // 条件を満たしているかチェック
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

  /**
   * 条件を満たしているかチェック
   */
  private meetsCondition(
    progress: PlayerProgress,
    condition: BadgeCondition
  ): boolean {
    switch (condition.type) {
      case 'complete_quest':
        // 特定のクエストを完了
        return progress.completedQuestIds.includes(condition.requirement);

      case 'complete_line':
        // 特定の路線の全クエストを完了
        // 簡略化のため、ここでは実装省略
        return false;

      case 'quiz_streak':
        // 連続正解数
        // 実装省略（統計情報を拡張する必要あり）
        return false;

      case 'play_days':
        // プレイ日数
        return progress.statistics.consecutiveDays >= condition.requirement;

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
}
