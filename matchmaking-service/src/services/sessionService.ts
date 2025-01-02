import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { Player } from '../models/player';
import { GameSession} from '../models/gameSession';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

export const assignPlayersToSession = async (players: Player[]): Promise<GameSession> => {
  const sessionId = uuidv4();
  const session: GameSession = { sessionId, players, createdAt: new Date() };
  await redis.set(`game_session:${sessionId}`, JSON.stringify(session), 'EX', 86400); // Expiration set to 24 hours
  console.log(`Game session created: ${JSON.stringify(session)}`);
  return session;
};