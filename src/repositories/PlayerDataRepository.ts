/**
 * プレイヤーデータリポジトリ
 */

import type { PlayerProgress } from '../types';
import { StorageError } from '../types';

export class PlayerDataRepository {
  private readonly STORAGE_KEY = 'railway_game_progress';
  private readonly BACKUP_KEY = 'railway_game_progress_backup';

  /**
   * プレイヤー進捗を保存
   */
  save(progress: PlayerProgress): void {
    try {
      // 現在のデータをバックアップ
      const current = localStorage.getItem(this.STORAGE_KEY);
      if (current) {
        localStorage.setItem(this.BACKUP_KEY, current);
      }

      // 新しいデータを保存
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      throw new StorageError('データの保存に失敗しました', error as Error);
    }
  }

  /**
   * プレイヤー進捗を読み込み
   */
  load(): PlayerProgress | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const progress = JSON.parse(data);
        // Date型を復元
        progress.createdAt = new Date(progress.createdAt);
        progress.lastPlayedAt = new Date(progress.lastPlayedAt);
        progress.badges = progress.badges.map((badge: any) => ({
          ...badge,
          earnedAt: new Date(badge.earnedAt),
        }));
        return progress;
      }

      // メインデータがない場合、バックアップを試みる
      const backup = localStorage.getItem(this.BACKUP_KEY);
      if (backup) {
        console.warn('バックアップからデータを復元しました');
        const progress = JSON.parse(backup);
        // Date型を復元
        progress.createdAt = new Date(progress.createdAt);
        progress.lastPlayedAt = new Date(progress.lastPlayedAt);
        progress.badges = progress.badges.map((badge: any) => ({
          ...badge,
          earnedAt: new Date(badge.earnedAt),
        }));
        return progress;
      }

      return null;
    } catch (error) {
      console.error('データの読み込みに失敗しました', error);
      return null;
    }
  }

  /**
   * プレイヤーデータが存在するか
   */
  exists(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  /**
   * プレイヤーデータをリセット
   */
  reset(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.BACKUP_KEY);
    } catch (error) {
      throw new StorageError('データのリセットに失敗しました', error as Error);
    }
  }
}
