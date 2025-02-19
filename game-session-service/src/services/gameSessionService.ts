import { GameSession } from '@maorte/strategos-services-common-package/dist/database/types';
import Redis from 'ioredis';
import { GameSessionRepository } from './repository';
import { HttpError } from '@maorte/strategos-services-common-package/dist/middleware';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

export const createGameSession = async (playerIds: string[]): Promise<GameSession> => {
  const newSession: GameSession = {
    players: playerIds,
    status: 'waiting',
  };
    //await redis.set(`game_session:${sessionId}`, JSON.stringify(newSession), 'EX', 86400); // Cache in Redis
    const createdSession = await GameSessionRepository.createGameSession(newSession);
    if (!createdSession) {
        throw new HttpError("Failed to create game session", 500);
    }

    return createdSession;
};

export const getGameSession = async (sessionId: string): Promise<GameSession> => {
    // const cachedSession = await redis.get(`game_session:${sessionId}`);
    // if (cachedSession) {
    //   return JSON.parse(cachedSession) as GameSession;
    // }
    
    const session = await GameSessionRepository.getGameSession(sessionId);
    if (!session) {
        throw new HttpError(`Game session ${sessionId} not found`, 404);
    }
    return session;
};

export const listGameSessions = async (): Promise<GameSession[]> => {
    //const cachedSessions = await redis.get('cached_game_sessions');
    //if (cachedSessions) return JSON.parse(cachedSessions) as GameSession[];
    //await redis.set('cached_game_sessions', JSON.stringify(sessions), 'EX', 3600);
    return await GameSessionRepository.listGameSessions();
  }

export const updateGameSessionStatus = async (sessionId: string, status: GameSession['status']): Promise<void> => {
  const updateResult = await GameSessionRepository.updateGameSessionStatus(sessionId, status);

    // Only check numUpdatedRows, since updateResult is never undefined
    if (updateResult.numUpdatedRows === 0n) {
        throw new HttpError(`Game session ${sessionId} not found`, 404);
    }
};

export const deleteGameSession = async (sessionId: string): Promise<void> => {
  const deleteResult = await GameSessionRepository.deleteGameSession(sessionId);

  // Check the numDeletedRows property of deleteResult
  if (deleteResult[0].numDeletedRows === 0n) {
    throw new HttpError("Game session not found", 404);
}
};