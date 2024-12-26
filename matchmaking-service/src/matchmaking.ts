import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

export interface Player {
  id: string;
  skill: number;
  timestamp: number;
}

const SKILL_THRESHOLD = parseInt(process.env.SKILL_THRESHOLD || '50', 10);

export const addPlayerToQueue = async (player: Player): Promise<void> => {
  try {
    const playerWithTimestamp = { ...player, timestamp: Date.now() };
    await redis.zadd('matchmaking_queue', player.skill, JSON.stringify(playerWithTimestamp));
    console.log(`Player added to queue: ${JSON.stringify(playerWithTimestamp)}`);
  } catch (error) {
    console.error(`Error adding player to queue: ${error}`);
    throw error;
  }
};

export const findMatch = async (): Promise<Player[] | null> => {
  try {
    const allPlayers = await redis.zrange('matchmaking_queue', 0, -1);
    for (let i = 0; i < allPlayers.length - 1; i++) {
      const player1 = JSON.parse(allPlayers[i]) as Player;
      const player2 = JSON.parse(allPlayers[i + 1]) as Player;

      if (Math.abs(player1.skill - player2.skill) <= SKILL_THRESHOLD) {
        await redis.zrem('matchmaking_queue', allPlayers[i], allPlayers[i + 1]);
        console.log(`Match found: ${JSON.stringify([player1, player2])}`);
        return [player1, player2];
      }
    }

    console.log('No match found within the skill threshold.');
    return null;
  } catch (error) {
    console.error(`Error finding match: ${error}`);
    throw error;
  }
};

export const prioritizeQueue = async (): Promise<Player[] | null> => {
  try {
    const allPlayers = await redis.zrange('matchmaking_queue', 0, -1);
    const parsedPlayers = allPlayers.map((player) => JSON.parse(player) as Player);

    parsedPlayers.sort((a, b) => {
      const skillDiff = Math.abs(a.skill - b.skill);
      const timeDiff = a.timestamp - b.timestamp;
      return skillDiff === 0 ? timeDiff : skillDiff;
    });

    console.log('Queue prioritized:', parsedPlayers);
    return parsedPlayers;
  } catch (error) {
    console.error(`Error prioritizing queue: ${error}`);
    throw error;
  }
};

console.error(`End of matchmaking-service/index.ts!`);