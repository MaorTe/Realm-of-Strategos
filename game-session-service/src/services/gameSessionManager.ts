import { GameSession } from '../models/gameSession';
import { v4 as uuidv4 } from 'uuid';

const gameSessions: Record<string, GameSession> = {};

export const createGameSession = (playerIds: string[]): GameSession => {
  const sessionId = uuidv4();
  const newSession: GameSession = {
    id: sessionId,
    players: playerIds,
    status: 'waiting',
    createdAt: new Date(),
  };

  gameSessions[sessionId] = newSession;
  console.log(`Game session created: ${JSON.stringify(newSession)}`);
  return newSession;
};

export const getGameSession = (sessionId: string): GameSession | undefined => {
  return gameSessions[sessionId];
};

export const updateGameSessionStatus = (
  sessionId: string,
  status: GameSession["status"] //'waiting' | 'active' | 'completed' | 
): void => {
  if (gameSessions[sessionId]) {
    gameSessions[sessionId].status = status;
    console.log(`Game session ${sessionId} updated to status: ${status}`);
  } else {
    console.error(`Game session ${sessionId} not found.`);
  }
};

export const listGameSessions = (): GameSession[] => {
  return Object.values(gameSessions);
};
