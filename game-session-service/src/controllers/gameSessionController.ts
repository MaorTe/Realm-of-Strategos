import { Request, Response } from 'express';
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
    res.status(400).json({ error: 'Invalid players array' });
    return;
  }

  try {
    const newSession = await createGameSession(players);
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Failed to create session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
};

export const retrieveSession = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const session = await getGameSession(id);
    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    res.json(session);
  } catch (error) {
    console.error('Failed to retrieve session:', error);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
};

export const listSessions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const allSessions = await listGameSessions();
    res.json(allSessions);
  } catch (error) {
    console.error('Failed to list sessions:', error);
    res.status(500).json({ error: 'Failed to list sessions' });
  }
};

export const updateSessionStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['waiting', 'active', 'completed'].includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  try {
    await updateGameSessionStatus(id, status);
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Failed to update session status:', error);
    res.status(500).json({ error: 'Failed to update session status' });
  }
};

export const deleteSession = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deleted = await deleteGameSession(id);
    if (!deleted) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    console.error('Failed to delete session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
};