import { GameSession } from '../models/gameSession';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';
import { query } from '@maorte/strategos-services-common-package/dist/database';
import { logger } from '@maorte/strategos-services-common-package/dist/logger';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

export const createGameSession = async (playerIds: string[]): Promise<GameSession> => {
  const sessionId = uuidv4();
  const newSession: GameSession = {
    id: sessionId,
    players: playerIds,
    status: 'waiting',
    createdAt: new Date(),
  };

  try {
    await redis.set(`game_session:${sessionId}`, JSON.stringify(newSession), 'EX', 86400); // Cache in Redis
    await query(
      'INSERT INTO game_sessions (id, players, status, created_at) VALUES ($1, $2, $3, $4)',
      [sessionId, JSON.stringify(playerIds), 'waiting', newSession.createdAt]
    ); // Persist in PostgreSQL
  } catch (error) {
    logger.error('Error creating game session:', error);
    throw error;
  }

  return newSession;
};

export const getGameSession = async (sessionId: string): Promise<GameSession | undefined> => {
  try {
    const cachedSession = await redis.get(`game_session:${sessionId}`);
    if (cachedSession) {
      return JSON.parse(cachedSession) as GameSession;
    }

    const dbSession = await query('SELECT * FROM game_sessions WHERE id = $1', [sessionId]);
    return dbSession.length > 0 ? dbSession[0] : undefined;
  } catch (error) {
    logger.error('Error fetching game session:', error);
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

    await redis.set(`game_session:${sessionId}`, JSON.stringify(session), 'EX', 86400); // Update cache
    await query('UPDATE game_sessions SET status = $1 WHERE id = $2', [status, sessionId]); // Update DB
  } catch (error) {
    logger.error('Error updating game session status:', error);
    throw error;
  }
};

export const deleteGameSession = async (sessionId: string): Promise<boolean> => {
  try {
    const deletedCount = await redis.del(`game_session:${sessionId}`); // Remove from cache
    if (deletedCount > 0) {
      await query('DELETE FROM game_sessions WHERE id = $1', [sessionId]); // Remove from DB
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Error deleting game session:', error);
    throw error;
  }
};