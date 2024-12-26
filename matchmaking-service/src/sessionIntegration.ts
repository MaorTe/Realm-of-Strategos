import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { Player } from './matchmaking';

type GameSession = {
    sessionId: string;
    players: Player[];
    createdAt: Date;
};

const redis = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

// Generate unique session ID
const generateSessionId = (): string => {
    return uuidv4();
};

// Assign players to a game session
export const assignPlayersToSession = async (players: Player[]): Promise<GameSession> => {
    const sessionId = generateSessionId();
    const session: GameSession = { sessionId, players, createdAt: new Date() };

    try {
        await redis.set(`game_session:${sessionId}`, JSON.stringify(session), 'EX', 86400); // Expiration set to 24 hours
        console.log(`Game session created: ${JSON.stringify(session)}`);
        return session;
    } catch (error) {
        console.error('Failed to create game session:', error);
        throw error;
    }
};