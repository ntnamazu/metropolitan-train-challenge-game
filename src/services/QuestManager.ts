/**
 * クエストマネージャー
 */

import type {
  Quest,
  QuestSession,
  StepResult,
  Reward,
  DifficultyLevel,
} from '../types';
import { NotFoundError } from '../types';
import type { QuizDataRepository } from '../repositories/QuizDataRepository';
import type { PuzzleDataRepository } from '../repositories/PuzzleDataRepository';
import type { RailwayDataRepository } from '../repositories/RailwayDataRepository';

export class QuestManager {
  private questSessions: Map<string, QuestSession> = new Map();

  private readonly levelQuestIds: Record<number, string[]> = {
    1: ['quest-sobu-01', 'quest-sobu-02', 'quest-tobu-kamedo-01'],
    2: ['quest-yamanote-01'],
    3: [],
    4: [],
  };

  constructor(
    private _railwayDataRepository: RailwayDataRepository,
    private _quizDataRepository: QuizDataRepository,
    private _puzzleDataRepository: PuzzleDataRepository
  ) {}

  private findQuestLevel(questId: string): number | null {
    for (const [level, ids] of Object.entries(this.levelQuestIds)) {
      if (ids.includes(questId)) return parseInt(level);
    }
    return null;
  }

  /**
   * クエストを読み込む
   */
  async loadQuest(questId: string): Promise<Quest> {
    try {
      const level = this.findQuestLevel(questId);
      if (level === null) {
        throw new NotFoundError('Quest', questId);
      }

      const match = questId.match(/quest-(.+)-(\d+)/);
      if (!match) {
        throw new NotFoundError('Quest', questId);
      }

      const lineName = match[1];
      const questNumber = match[2];
      const response = await fetch(
        `/data/quests/level${level}/quest-${lineName}-${questNumber}.json`
      );

      if (!response.ok) {
        throw new NotFoundError('Quest', questId);
      }

      const quest = (await response.json()) as Quest;
      return quest;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new NotFoundError('Quest', questId);
    }
  }

  /**
   * クエストを開始
   */
  async startQuest(questId: string): Promise<QuestSession> {
    await this.loadQuest(questId);

    const session: QuestSession = {
      sessionId: crypto.randomUUID(),
      questId,
      currentStepIndex: 0,
      startedAt: new Date(),
      results: [],
    };

    this.questSessions.set(session.sessionId, session);

    return session;
  }

  /**
   * ステップを完了
   */
  completeStep(sessionId: string, result: StepResult): QuestSession {
    const session = this.questSessions.get(sessionId);
    if (!session) {
      throw new NotFoundError('QuestSession', sessionId);
    }

    session.results.push(result);
    session.currentStepIndex++;

    return session;
  }

  /**
   * クエストを完了
   */
  async completeQuest(sessionId: string): Promise<Reward[]> {
    const session = this.questSessions.get(sessionId);
    if (!session) {
      throw new NotFoundError('QuestSession', sessionId);
    }

    const quest = await this.loadQuest(session.questId);

    // セッションを削除
    this.questSessions.delete(sessionId);

    return quest.rewards;
  }

  /**
   * 利用可能なクエストを取得
   */
  async getAvailableQuests(level: DifficultyLevel): Promise<Quest[]> {
    const questIds = this.levelQuestIds[level] ?? [];
    const quests: Quest[] = [];

    for (const questId of questIds) {
      try {
        const quest = await this.loadQuest(questId);
        quests.push(quest);
      } catch {
        continue;
      }
    }

    return quests;
  }
}
