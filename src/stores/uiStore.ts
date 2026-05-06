import { create } from 'zustand';

export type Screen =
  | 'home'
  | 'quest-list'
  | 'quest-play'
  | 'collection'
  | 'daily-challenge';

interface UiState {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
}

export const useUiStore = create<UiState>((set) => ({
  currentScreen: 'home',
  navigate: (screen) => set({ currentScreen: screen }),
}));
