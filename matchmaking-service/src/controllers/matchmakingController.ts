import { Request, Response } from 'express';
import { addPlayerToQueue, findMatch } from '../services/matchmakingService';
import { publishMessage } from '@maorte/strategos-services-common-package/dist/utils/messaging';
import { broadcastMessage } from '../utils/websocketServer';

export const queuePlayer = async (req: Request, res: Response): Promise<void> => {
  const { id, skill } = req.body;

  if (!id || typeof skill !== 'number') {
    res.status(400).json({ error: 'Invalid input. Player ID and skill are required.' });
    return;
  }

  try {
    await addPlayerToQueue({ id, skill, timestamp: Date.now() });
    res.status(200).json({ message: 'Player added to queue' });
  } catch (error) {
    console.error('Failed to add player to queue:', error);
    res.status(500).json({ error: 'Failed to add player to queue' });
  }
};

export const findMatchAndPublish = async (_req: Request, res: Response): Promise<void> => {
  try {
    const match = await findMatch();
    if (match) {
      const queue = 'matchmaking-session';
      await publishMessage(queue, { match });
      res.status(200).json({ message: 'Match found and published', match });
    } else {
      res.status(404).json({ message: 'No match found' });
    }
  } catch (error) {
    console.error('Failed to find match and publish:', error);
    res.status(500).json({ error: 'Failed to find match and publish' });
  }
};

export const findMatchAndNotify = async (_req: Request, res: Response): Promise<void> => {
  try {
    const match = await findMatch();
    if (match) {
      broadcastMessage({ type: 'match-found', data: match });
      res.status(200).json({ message: 'Match found and clients notified', match });
    } else {
      res.status(404).json({ message: 'No match found' });
    }
  } catch (error) {
    console.error('Failed to find match and notify:', error);
    res.status(500).json({ error: 'Failed to find match and notify' });
  }
};