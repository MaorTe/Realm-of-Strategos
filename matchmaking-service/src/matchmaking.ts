import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Redis with environment variables for host and port
const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

redis.set('test', 'connection-check').then(() => {
  console.log('Redis connection is successful!');
}).catch((error) => {
  console.error('Redis connection failed:', error);
});
// Define the Player interface
export interface Player {
  id: string;
  skill: number;
}

// Add a player to the matchmaking queue
export const addPlayerToQueue = async (player: Player): Promise<void> => {
  try {
    await redis.zadd('matchmaking_queue', player.skill, JSON.stringify(player));
    console.log(`Player added to queue: ${JSON.stringify(player)}`);
  } catch (error) {
    console.error(`Error adding player to queue: ${error}`);
    throw error;
  }
};

// Find a match from the queue
export const findMatch = async (): Promise<Player[] | null> => {
  try {
    const players = await redis.zrange('matchmaking_queue', 0, 1); // Retrieve top two players
    if (players.length >= 2) {
      const parsedPlayers = players.map((p) => JSON.parse(p) as Player);
      await redis.zrem('matchmaking_queue', ...players); // Remove them from the queue
      console.log(`Match found: ${JSON.stringify(parsedPlayers)}`);
      return parsedPlayers;
    }
    console.log('No match found.');
    return null;
  } catch (error) {
    console.error(`Error finding match: ${error}`);
    throw error;
  }
};

console.error(`End of matchmaking-service/index.ts!`);