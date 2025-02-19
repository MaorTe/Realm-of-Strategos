import { Request, Response } from 'express';
import { addPlayerToQueue, findMatch } from '../services/matchmakingService';
import { publishMessage } from '@maorte/strategos-services-common-package/dist/messaging';
import { logger } from '@maorte/strategos-services-common-package/dist/logger';
import { broadcastMessage } from '../utils/websocketServer';

export const queuePlayer = async (req: Request, res: Response): Promise<void> => {
  const { id, skill } = req.body;

  if (!id || typeof skill !== 'number') {
    logger.warn('Invalid input. Player ID and skill are required.');
    res.status(400).json({ error: 'Invalid input. Player ID and skill are required.' });
    return;
  }

  await addPlayerToQueue({ id, skill, timestamp: Date.now() });
  logger.info(`Player added to matchmaking queue: ${id}`);
  res.status(200).json({ message: 'Player added to queue' });
};

export const findMatchAndPublish = async (req: Request, res: Response): Promise<void> => {
    const match = await findMatch(req as any);
    if (!match) {
      logger.warn("No match found.");
      res.status(404).json({ message: "No match found" });
    }

      const queue = 'matchmaking-session';
      await publishMessage(queue, { match });
      logger.info('Match found and published:', { match });
      res.status(200).json({ message: 'Match found and published', match });
};

export const findMatchAndNotify = async (req: Request, res: Response): Promise<void> => {
    const match = await findMatch(req as any);

    if (!match) {
      logger.warn("No match found.");
      res.status(404).json({ message: "No match found" });
    }
      broadcastMessage({ type: 'match-found', data: match });
      logger.info('Match found and clients notified', { match });
      res.status(200).json({ message: 'Match found and clients notified', match });
};