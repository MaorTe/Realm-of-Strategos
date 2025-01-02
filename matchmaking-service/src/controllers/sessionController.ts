import { Request, Response } from 'express';
import { assignPlayersToSession } from '../services/sessionService';
import { findMatch } from '../services/matchmakingService';

export const createSession = async (_req: Request, res: Response): Promise<void> => {
  try {
    const match = await findMatch();
    if (match) {
      const session = await assignPlayersToSession(match);
      res.status(200).json({ session });
    } else {
      res.status(404).json({ message: 'No match found' });
    }
  } catch (error) {
    console.error('Failed to assign players to session:', error);
    res.status(500).json({ error: 'Failed to assign players to session' });
  }
};