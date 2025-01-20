import Redis from 'ioredis';
import { query } from '@maorte/strategos-services-common-package/src/database';
import { Player } from '../models/player';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

const SKILL_THRESHOLD = parseInt(process.env.SKILL_THRESHOLD || '50', 10);

export const addPlayerToQueue = async (player: Player): Promise<void> => {
  await redis.zadd('matchmaking_queue', player.skill, JSON.stringify(player));
};

export const findMatch = async (): Promise<Player[] | null> => {
  const allPlayers = await redis.zrange('matchmaking_queue', 0, -1);
  for (let i = 0; i < allPlayers.length - 1; i++) {
    const player1 = JSON.parse(allPlayers[i]) as Player;
    const player2 = JSON.parse(allPlayers[i + 1]) as Player;

    if (Math.abs(player1.skill - player2.skill) <= SKILL_THRESHOLD) {
      await redis.zrem('matchmaking_queue', allPlayers[i], allPlayers[i + 1]);

      // Save match in PostgreSQL
      await query('INSERT INTO matches (players, created_at) VALUES ($1, $2)', [
        JSON.stringify([player1, player2]),
        new Date(),
      ]);

      return [player1, player2];
    }
  }
  return null;
};