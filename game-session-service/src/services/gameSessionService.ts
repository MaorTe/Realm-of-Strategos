import { GameSession } from './types';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';
import { logger } from '@maorte/strategos-services-common-package/dist/logger';
import { GameSessionRepository } from './repository';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

export const createGameSession = async (playerIds: string[]): Promise<GameSession> => {
  //const sessionId = uuidv4();
  const newSession: GameSession = {
    players: playerIds,
    status: 'waiting',
  };

  try {
    //await redis.set(`game_session:${sessionId}`, JSON.stringify(newSession), 'EX', 86400); // Cache in Redis
    await GameSessionRepository.createGameSession(newSession); // Persist in PostgreSQL
    
  } catch (error) {
    logger.error('Error creating game session:', error);
    throw error;
  }

  return newSession;
};

export const getGameSession = async (sessionId: string): Promise<GameSession | undefined> => {
  try {
    // const cachedSession = await redis.get(`game_session:${sessionId}`);
    // if (cachedSession) {
    //   return JSON.parse(cachedSession) as GameSession;
    // }
    
    return await GameSessionRepository.getGameSession(sessionId);
  } catch (error) {
    logger.error('Error fetching game session:', error);
    throw error;
  }
};

export const listGameSessions = async (): Promise<GameSession[]> => {
  try {
    //const cachedSessions = await redis.get('cached_game_sessions');
    //if (cachedSessions) return JSON.parse(cachedSessions) as GameSession[];

    const sessions = await GameSessionRepository.listGameSessions();
    //await redis.set('cached_game_sessions', JSON.stringify(sessions), 'EX', 3600);
    return sessions;
  } catch (error) {
    logger.error('Failed to list game sessions', { error });
    throw error;
  }
};

export const updateGameSessionStatus = async (sessionId: string, status: GameSession['status']): Promise<void> => {
  try {
    const session = await getGameSession(sessionId);
    if (!session) {
      throw new Error(`Game session ${sessionId} not found.`);
    }

    session.status = status;
    //await redis.set(`game_session:${sessionId}`, JSON.stringify(session), 'EX', 86400); // Update cache
    await GameSessionRepository.updateGameSessionStatus(sessionId, status);
  } catch (error) {
    logger.error('Error updating game session status:', error);
    throw error;
  }
};

export const deleteGameSession = async (sessionId: string): Promise<boolean> => {
  try {
    //const deletedCount = await redis.del(`game_session:${sessionId}`); // Remove from cache
    //if (deletedCount > 0) {
      await GameSessionRepository.deleteGameSession(sessionId); // Remove from DB
      return true;
    //}
    //return false;
  } catch (error) {
    logger.error('Error deleting game session:', error);
    throw error;
  }
};