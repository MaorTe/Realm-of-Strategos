import { Request, Response } from 'express';
import { logger } from '@maorte/strategos-services-common-package/dist/logger';
import {
  createGameSession,
  getGameSession,
  listGameSessions,
  updateGameSessionStatus,
  deleteGameSession,
} from '../services/gameSessionService';

export const createSession = async (req: Request, res: Response): Promise<void> => {
  const { players } = req.body;
  if (!Array.isArray(players) || players.some((p: any) => typeof p !== 'string')) {
    logger.warn('Invalid players array.');
    res.status(400).json({ error: 'Invalid players array' });
    return;
  }

    const newSession = await createGameSession(players);
    logger.info('Game session created:', { newSession });
    res.status(201).json(newSession);
};

export const retrieveSession = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const session = await getGameSession(id);
  logger.info('Game session retrieved:', { session });
  res.json(session);
};

export const listSessions = async (_req: Request, res: Response): Promise<void> => {
  const allSessions = await listGameSessions();
  logger.info('All game sessions retrieved.', { count: allSessions.length });
  res.json(allSessions);
};

export const updateSessionStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['waiting', 'active', 'completed'].includes(status)) {
    logger.warn('Invalid status provided:', { status });
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

    await updateGameSessionStatus(id, status);
    logger.info(`Game session status updated: ${id}`, { status });
    res.json({ message: 'Status updated successfully' });
};

export const deleteSession = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await deleteGameSession(id);
  logger.info(`Game session deleted: ${id}`);
  res.status(204).send();
};