import { create } from 'zustand';
import type {
  Quest,
  QuestSession,
  QuizQuestion,
  QuizResult,
  PuzzleData,
  PuzzleState,
  PuzzleResult,
  RailwayMap,
  DifficultyLevel,
} from '../types';
import { questManager, quizEngine, puzzleEngine } from '../services/instances';

interface QuestState {
  availableQuests: Quest[];
  isLoadingQuests: boolean;
  selectedQuest: Quest | null;
  currentSession: QuestSession | null;
  currentStepIndex: number;
  quizQuestions: QuizQuestion[];
  currentQuizIndex: number;
  quizResults: QuizResult[];
  puzzleData: PuzzleData | null;
  puzzleState: PuzzleState | null;
  puzzleRailwayMap: RailwayMap | null;
  puzzleResult: PuzzleResult | null;
  questCompleted: boolean;
  rewards: Quest['rewards'];
  loadAvailableQuests: (level?: DifficultyLevel) => Promise<void>;
  selectQuest: (quest: Quest) => void;
  startQuest: () => Promise<void>;
  submitQuizAnswer: (selectedIndex: number) => QuizResult | null;
  nextQuiz: () => void;
  initializePuzzle: (
    puzzleData: PuzzleData,
    railwayMap: RailwayMap
  ) => Promise<void>;
  selectPuzzleStation: (stationId: string) => Promise<void>;
  submitPuzzle: () => Promise<PuzzleResult | null>;
  completeCurrentStep: (success: boolean, score: number) => void;
  completeQuest: () => Promise<Quest['rewards']>;
  resetQuest: () => void;
}

export const useQuestStore = create<QuestState>((set, get) => ({
  availableQuests: [],
  isLoadingQuests: false,
  selectedQuest: null,
  currentSession: null,
  currentStepIndex: 0,
  quizQuestions: [],
  currentQuizIndex: 0,
  quizResults: [],
  puzzleData: null,
  puzzleState: null,
  puzzleRailwayMap: null,
  puzzleResult: null,
  questCompleted: false,
  rewards: [],

  loadAvailableQuests: async (level = 1) => {
    set({ isLoadingQuests: true });
    try {
      const quests = await questManager.getAvailableQuests(level);
      set({ availableQuests: quests, isLoadingQuests: false });
    } catch {
      set({ isLoadingQuests: false });
    }
  },

  selectQuest: (quest) => set({ selectedQuest: quest }),

  startQuest: async () => {
    const { selectedQuest } = get();
    if (!selectedQuest) return;

    const session = await questManager.startQuest(selectedQuest.id);
    const step = selectedQuest.steps[0];

    const quizQuestions: QuizQuestion[] =
      step.type === 'quiz' && Array.isArray(step.content)
        ? (step.content as QuizQuestion[])
        : [];

    set({
      currentSession: session,
      currentStepIndex: 0,
      quizQuestions,
      currentQuizIndex: 0,
      quizResults: [],
      puzzleData: null,
      puzzleState: null,
      puzzleRailwayMap: null,
      puzzleResult: null,
      questCompleted: false,
      rewards: [],
    });
  },

  submitQuizAnswer: (selectedIndex) => {
    const { quizQuestions, currentQuizIndex } = get();
    const question = quizQuestions[currentQuizIndex];
    if (!question) return null;

    const result = quizEngine.submitAnswer(question, selectedIndex);
    const newResults = [...get().quizResults, result];
    set({ quizResults: newResults });
    return result;
  },

  nextQuiz: () => {
    set((state) => ({ currentQuizIndex: state.currentQuizIndex + 1 }));
  },

  initializePuzzle: async (puzzleData, railwayMap) => {
    const state = await puzzleEngine.initializePuzzle(puzzleData);
    set({ puzzleData, puzzleState: state, puzzleRailwayMap: railwayMap });
  },

  selectPuzzleStation: async (stationId) => {
    const { puzzleData, puzzleState } = get();
    if (!puzzleData || !puzzleState) return;

    const selection = await puzzleEngine.selectStation(
      puzzleData.id,
      stationId
    );
    if (selection.valid) {
      const isGoal = stationId === puzzleData.goalStation;
      set({
        puzzleState: {
          ...puzzleState,
          selectedPath: selection.currentPath,
          status: isGoal ? 'completed' : 'in_progress',
        },
      });
    }
  },

  submitPuzzle: async () => {
    const { puzzleData, puzzleState } = get();
    if (!puzzleData || !puzzleState) return null;

    const result = await puzzleEngine.validatePath(
      puzzleData.id,
      puzzleState.selectedPath
    );
    const pathSuccess =
      puzzleState.selectedPath[puzzleState.selectedPath.length - 1] ===
      puzzleData.goalStation;
    const finalResult: PuzzleResult = {
      ...result,
      success: pathSuccess,
      correctPath: puzzleData.correctPath,
    };
    set({ puzzleResult: finalResult });
    return finalResult;
  },

  completeCurrentStep: (success, score) => {
    const { currentSession, currentStepIndex } = get();
    if (!currentSession) return;

    const updatedSession = questManager.completeStep(currentSession.sessionId, {
      stepIndex: currentStepIndex,
      success,
      score,
      completedAt: new Date(),
    });

    set({
      currentSession: updatedSession,
      currentStepIndex: currentStepIndex + 1,
    });
  },

  completeQuest: async () => {
    const { currentSession } = get();
    if (!currentSession) return [];

    const rewards = await questManager.completeQuest(currentSession.sessionId);
    set({ questCompleted: true, rewards });
    return rewards;
  },

  resetQuest: () =>
    set({
      selectedQuest: null,
      currentSession: null,
      currentStepIndex: 0,
      quizQuestions: [],
      currentQuizIndex: 0,
      quizResults: [],
      puzzleData: null,
      puzzleState: null,
      puzzleRailwayMap: null,
      puzzleResult: null,
      questCompleted: false,
      rewards: [],
    }),
}));
