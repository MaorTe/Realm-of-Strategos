import { Request, Response } from 'express';
import {
  createGameSession,
  getGameSession,
  updateGameSessionStatus,
  listGameSessions,
  deleteGameSession,
} from '../services/gameSessionService';

export const createSession = (req: Request, res: Response): void => {
  const { players } = req.body;
  if (!Array.isArray(players) || players.some((p: any) => typeof p !== 'string')) {
    res.status(400).json({ error: 'Invalid players array' });
    return;
  }

  const newSession = createGameSession(players);
  res.status(201).json(newSession);
};

export const retrieveSession = (req: Request, res: Response): void => {
  const { id } = req.params;
  const session = getGameSession(id);

  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  res.json(session);
};

export const listSessions = (_req: Request, res: Response): void => {
  const allSessions = listGameSessions();
  res.json(allSessions);
};

export const updateSessionStatus = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['waiting', 'active', 'completed'].includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  try {
    updateGameSessionStatus(id, status);
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(404).json({ error: 'Session not found' });
  }
};

export const deleteSession = (req: Request, res: Response): void => {
  const { id } = req.params;

  const deleted = deleteGameSession(id);
  if (!deleted) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  res.status(204).send();
};