import Redis from 'ioredis';
import { MatchmakingRepository } from './repository';
import { HttpError, Player } from '@maorte/strategos-services-common-package/dist';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

const SKILL_THRESHOLD = parseInt(process.env.SKILL_THRESHOLD || '50', 10);

export const addPlayerToQueue = async (player: Player): Promise<void> => {
  await redis.zadd('matchmaking_queue', player.skill, JSON.stringify(player));
};

export const findMatch = async (req : Request): Promise<Player[] | null> => {
  const user = (req as any).user; // Assuming you attach the user object to the request

  const allPlayers = await redis.zrange('matchmaking_queue', 0, -1);
  if (allPlayers.length < 2) {
    return null; // Not enough players in queue
  }

  for (let i = 0; i < allPlayers.length - 1; i++) {
    const player1 = JSON.parse(allPlayers[i]) as Player;
    const player2 = JSON.parse(allPlayers[i + 1]) as Player;

    if (Math.abs(player1.skill - player2.skill) <= SKILL_THRESHOLD) {
      await redis.zrem('matchmaking_queue', allPlayers[i], allPlayers[i + 1]);

      // Save match in PostgreSQL using repository
      // const match = await MatchmakingRepository.saveMatch(player1.id as string, player2?.id as string);
      // if (!match) {
      //   throw new HttpError("Failed to save match", 500);
      // }
      return [player1, player2];
    }
  }
  return null;
};