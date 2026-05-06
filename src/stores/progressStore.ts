import { create } from 'zustand';
import type { PlayerProgress, Reward } from '../types';
import { progressManager, badgeSystem } from '../services/instances';

interface ProgressState {
  progress: PlayerProgress | null;
  isLoading: boolean;
  initProgress: () => void;
  updateProgress: (progress: PlayerProgress) => void;
  completeQuest: (questId: string, rewards: Reward[]) => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: null,
  isLoading: false,

  initProgress: () => {
    set({ isLoading: true });
    let progress = progressManager.loadProgress();
    if (!progress) {
      progress = progressManager.createInitialProgress();
    }
    set({ progress, isLoading: false });
  },

  updateProgress: (progress) => {
    progressManager.saveProgress(progress);
    set({ progress });
  },

  completeQuest: (questId, rewards) => {
    const { progress, updateProgress } = get();
    if (!progress) return;

    const updated = { ...progress };
    if (!updated.completedQuestIds.includes(questId)) {
      updated.completedQuestIds = [...updated.completedQuestIds, questId];
    }

    for (const reward of rewards) {
      if (reward.type === 'railway_line') {
        progressManager.unlockContent(updated, 'line', reward.id);
      } else if (reward.type === 'vehicle_card') {
        progressManager.unlockContent(updated, 'vehicle', reward.id);
      } else if (reward.type === 'points') {
        const pointsMatch = reward.name.match(/(\d+)/);
        const points = pointsMatch ? parseInt(pointsMatch[1], 10) : 100;
        updated.totalPoints += points;
      }
    }

    const newBadges = badgeSystem.checkBadgeConditions(updated);
    for (const badge of newBadges) {
      progressManager.earnBadge(
        updated,
        badge.id,
        badge.name,
        badge.description
      );
    }

    const newLevel = progressManager.checkLevelUp(updated);
    if (newLevel) {
      updated.currentLevel = newLevel;
    }

    updated.lastPlayedAt = new Date();
    updateProgress(updated);
  },
}));
