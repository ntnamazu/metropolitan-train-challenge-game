import { RailwayDataRepository } from '../repositories/RailwayDataRepository';
import { QuizDataRepository } from '../repositories/QuizDataRepository';
import { PuzzleDataRepository } from '../repositories/PuzzleDataRepository';
import { PlayerDataRepository } from '../repositories/PlayerDataRepository';
import { VehicleCardRepository } from '../repositories/VehicleCardRepository';
import { QuestManager } from './QuestManager';
import { QuizEngine } from './QuizEngine';
import { PuzzleEngine } from './PuzzleEngine';
import { ProgressManager } from './ProgressManager';
import { BadgeSystem } from './BadgeSystem';
import { DailyChallengeManager } from './DailyChallengeManager';

export const railwayRepo = new RailwayDataRepository();
export const quizRepo = new QuizDataRepository(railwayRepo);
export const puzzleRepo = new PuzzleDataRepository(railwayRepo);
const playerRepo = new PlayerDataRepository();

export const questManager = new QuestManager(railwayRepo, quizRepo, puzzleRepo);
export const quizEngine = new QuizEngine(quizRepo);
export const puzzleEngine = new PuzzleEngine(puzzleRepo, railwayRepo);
export const progressManager = new ProgressManager(playerRepo);
export const badgeSystem = new BadgeSystem();
export const dailyChallengeManager = new DailyChallengeManager();
export const vehicleCardRepository = new VehicleCardRepository();
