import { Request, Response } from 'express';
import logger from '@maorte/strategos-services-common-package/dist/utils/logger';
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

  try {
    const newSession = await createGameSession(players);
    logger.info('Game session created:', { newSession });
    res.status(201).json(newSession);
  } catch (error) {
    logger.error('Failed to create session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
};

export const retrieveSession = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const session = await getGameSession(id);
    if (!session) {
      logger.warn(`Session not found: ${id}`);
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    logger.info('Game session retrieved:', { session });
    res.json(session);
  } catch (error) {
    logger.error('Failed to retrieve session:', error);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
};

export const listSessions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const allSessions = await listGameSessions();
    logger.info('All game sessions retrieved.', { count: allSessions.length });
    res.json(allSessions);
  } catch (error) {
    logger.error('Failed to list game sessions:', error);
    res.status(500).json({ error: 'Failed to list sessions' });
  }
};

export const updateSessionStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['waiting', 'active', 'completed'].includes(status)) {
    logger.warn('Invalid status provided:', { status });
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  try {
    await updateGameSessionStatus(id, status);
    logger.info(`Game session status updated: ${id}`, { status });
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    logger.error(`Failed to update status for game session: ${id}`, error);
    res.status(500).json({ error: 'Failed to update session status' });
  }
};

export const deleteSession = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deleted = await deleteGameSession(id);
    if (!deleted) {
      logger.warn(`Game session not found for deletion: ${id}`);
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    logger.info(`Game session deleted: ${id}`);
    res.status(204).send();
  } catch (error) {
    logger.error(`Failed to delete game session: ${id}`, error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
};