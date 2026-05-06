/**
 * デイリーチャレンジマネージャー
 */

import type { Quest, PlayerProgress } from '../types';

export class DailyChallengeManager {
  /**
   * 今日のクエストを取得
   */
  getDailyQuest(date: string, availableQuests: Quest[]): Quest {
    // 日付をシード値として使い、クエストを選択
    const seed = this.dateToSeed(date);
    const index = seed % availableQuests.length;

    return availableQuests[index];
  }

  /**
   * デイリーチャレンジが完了済みかチェック
   */
  checkCompletion(progress: PlayerProgress): boolean {
    const today = new Date().toISOString().split('T')[0];

    return (
      progress.dailyChallenge.date === today &&
      progress.dailyChallenge.completed
    );
  }

  /**
   * デイリーチャレンジを完了としてマーク
   */
  markAsCompleted(progress: PlayerProgress, questId: string): void {
    const today = new Date().toISOString().split('T')[0];

    progress.dailyChallenge = {
      date: today,
      questId,
      completed: true,
      bonusPoints: 100,
    };
  }

  /**
   * ボーナスポイントを付与
   */
  awardBonusPoints(progress: PlayerProgress): void {
    progress.totalPoints += progress.dailyChallenge.bonusPoints;
  }

  /**
   * 日付をリセット（日付が変わった場合）
   */
  resetIfNeeded(progress: PlayerProgress): void {
    const today = new Date().toISOString().split('T')[0];

    if (progress.dailyChallenge.date !== today) {
      progress.dailyChallenge = {
        date: today,
        questId: '',
        completed: false,
        bonusPoints: 100,
      };
    }
  }

  /**
   * 日付をシード値に変換
   */
  private dateToSeed(date: string): number {
    // "YYYY-MM-DD" 形式の日付文字列を数値に変換
    const parts = date.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    return year * 10000 + month * 100 + day;
  }
}
