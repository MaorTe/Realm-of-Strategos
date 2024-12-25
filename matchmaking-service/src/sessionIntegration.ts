import Redis from 'ioredis';
import { Player } from './matchmaking';

type GameSession = {
    sessionId: string;
    players: Player[];
};

const redis = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

// Generate unique session ID
const generateSessionId = (): string => {
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

// Assign players to a game session
export const assignPlayersToSession = async (players: Player[]): Promise<GameSession> => {
    const sessionId = generateSessionId();
    const session: GameSession = { sessionId, players };

    try {
        await redis.set(`game_session:${sessionId}`, JSON.stringify(session));
        console.log(`Game session created: ${JSON.stringify(session)}`);
        return session;
    } catch (error) {
        console.error('Failed to create game session:', error);
        throw error;
    }
};