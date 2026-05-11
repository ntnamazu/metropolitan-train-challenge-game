/**
 * 進捗管理マネージャー
 */

import type { PlayerProgress, Badge, DifficultyLevel } from '../types';
import type { PlayerDataRepository } from '../repositories/PlayerDataRepository';

export class ProgressManager {
  constructor(private playerDataRepository: PlayerDataRepository) {}

  /**
   * プレイヤー進捗を読み込み
   */
  loadProgress(): PlayerProgress | null {
    return this.playerDataRepository.load();
  }

  /**
   * プレイヤー進捗を保存
   */
  saveProgress(progress: PlayerProgress): void {
    this.playerDataRepository.save(progress);
  }

  /**
   * コンテンツをアンロック
   */
  unlockContent(
    progress: PlayerProgress,
    contentType: 'line' | 'vehicle' | 'badge',
    contentId: string
  ): void {
    switch (contentType) {
      case 'line':
        if (!progress.unlockedLineIds.includes(contentId)) {
          progress.unlockedLineIds.push(contentId);
        }
        break;

      case 'vehicle':
        if (!progress.unlockedVehicleIds.includes(contentId)) {
          progress.unlockedVehicleIds.push(contentId);
        }
        break;

      case 'badge':
        // バッジは earnBadge() で処理
        break;
    }

    this.saveProgress(progress);
  }

  /**
   * レベルアップ判定
   */
  checkLevelUp(progress: PlayerProgress): DifficultyLevel | null {
    const completedByLevel = this.countCompletedQuestsByLevel(progress);

    if (progress.currentLevel === 1 && completedByLevel[1] >= 3) {
      return 2;
    }

    if (progress.currentLevel === 2 && completedByLevel[2] >= 5) {
      return 3;
    }

    if (progress.currentLevel === 3 && completedByLevel[3] >= 8) {
      return 4;
    }

    return null; // レベルアップなし
  }

  /**
   * レベル別の完了クエスト数をカウント
   */
  private countCompletedQuestsByLevel(progress: PlayerProgress): {
    [level: number]: number;
  } {
    const counts: { [level: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const byLevel = progress.completedQuestsByLevel;

    if (byLevel && Object.keys(byLevel).length > 0) {
      for (const [level, ids] of Object.entries(byLevel)) {
        counts[parseInt(level)] = ids.length;
      }
    } else {
      // 後方互換: completedQuestsByLevel 未設定の場合は全クエストをレベル1とみなす
      counts[1] = progress.completedQuestIds.length;
    }

    return counts;
  }

  /**
   * バッジを獲得
   */
  earnBadge(
    progress: PlayerProgress,
    badgeId: string,
    badgeName: string,
    description: string
  ): Badge {
    const badge: Badge = {
      id: badgeId,
      name: badgeName,
      description,
      earnedAt: new Date(),
    };

    progress.badges.push(badge);
    this.saveProgress(progress);

    return badge;
  }

  /**
   * 初期プレイヤー進捗を作成
   */
  createInitialProgress(): PlayerProgress {
    const progress: PlayerProgress = {
      playerId: crypto.randomUUID(),
      currentLevel: 1,
      completedQuestIds: [],
      completedQuestsByLevel: {},
      unlockedLineIds: ['line-sobu', 'line-tobu-kamedo'],
      unlockedVehicleIds: [],
      badges: [],
      totalPoints: 0,
      dailyChallenge: {
        date: new Date().toISOString().split('T')[0],
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
    };

    this.saveProgress(progress);
    return progress;
  }
}
