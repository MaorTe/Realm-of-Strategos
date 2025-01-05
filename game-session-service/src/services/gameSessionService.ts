import { GameSession } from '../models/gameSession';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

// In-memory storage as a fallback
const gameSessions: Record<string, GameSession> = {};

// Create a new game session
export const createGameSession = async (playerIds: string[]): Promise<GameSession> => {
  const sessionId = uuidv4();
  const newSession: GameSession = {
    id: sessionId,
    players: playerIds,
    status: 'waiting',
    createdAt: new Date(),
  };

  // Persist the session in Redis with expiration
  try {
    await redis.set(`game_session:${sessionId}`, JSON.stringify(newSession), 'EX', 86400);
    console.log(`Game session persisted in Redis: ${JSON.stringify(newSession)}`);
  } catch (error) {
    console.error('Failed to persist game session in Redis:', error);
    gameSessions[sessionId] = newSession; // Fallback to in-memory
  }

  return newSession;
};

// Get a specific game session
export const getGameSession = async (sessionId: string): Promise<GameSession | undefined> => {
  try {
    const session = await redis.get(`game_session:${sessionId}`);
    if (session) {
      return JSON.parse(session) as GameSession;
    }
  } catch (error) {
    console.error(`Failed to retrieve session from Redis: ${error}`);
  }
  return gameSessions[sessionId]; // Fallback to in-memory
};

// List all game sessions
export const listGameSessions = async (): Promise<GameSession[]> => {
  try {
    const keys = await redis.keys('game_session:*');
    const sessions = await Promise.all(
      keys.map(async (key: string) => {
        const session = await redis.get(key);
        return session ? (JSON.parse(session) as GameSession) : null;
      })
    );
    return sessions.filter((session): session is GameSession => session !== null);
  } catch (error) {
    console.error('Failed to list sessions from Redis:', error);
  }
  return Object.values(gameSessions); // Fallback to in-memory
};

// Update session status
export const updateGameSessionStatus = async (
  sessionId: string,
  status: GameSession['status']
): Promise<void> => {
  try {
    const session = await getGameSession(sessionId);
    if (!session) {
      throw new Error(`Game session ${sessionId} not found.`);
    }
    session.status = status;

    // Persist updated session
    await redis.set(`game_session:${sessionId}`, JSON.stringify(session), 'EX', 86400);
    console.log(`Game session ${sessionId} updated to status: ${status}`);
  } catch (error) {
    console.error('Failed to update session status in Redis:', error);
    if (gameSessions[sessionId]) {
      gameSessions[sessionId].status = status;
    } else {
      throw new Error(`Game session ${sessionId} not found in memory.`);
    }
  }
};

// Delete a game session
export const deleteGameSession = async (sessionId: string): Promise<boolean> => {
  try {
    const deletedCount = await redis.del(`game_session:${sessionId}`);
    if (deletedCount > 0) {
      console.log(`Game session ${sessionId} deleted from Redis.`);
      return true;
    }
  } catch (error) {
    console.error(`Failed to delete session from Redis: ${error}`);
  }

  if (gameSessions[sessionId]) {
    delete gameSessions[sessionId];
    console.log(`Game session ${sessionId} deleted from in-memory storage.`);
    return true;
  }

  return false;
};