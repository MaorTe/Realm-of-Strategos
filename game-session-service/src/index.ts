import { createSession, getSessionById } from '@maorte/strategos-services-common-package/dist/services/sessionService';
import { createGameSession, getGameSession, updateGameSessionStatus, listGameSessions } from './services/gameSessionManager';
import express, { Request, Response ,NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Define types
interface GameSession {
  id: string;
  players: string[];
  status: 'waiting' | 'active' | 'completed';
}

const app = express();
app.use(express.json());

// In-memory storage for game sessions
const gameSessions: Record<string, GameSession> = {};

// Create a new game session
app.post('/sessions', (req: Request, res: Response) => {
  const sessionId = uuidv4();
  const newSession: GameSession = {
    id: sessionId,
    players: [],
    status: 'waiting',
  };

  gameSessions[sessionId] = newSession;
  res.status(201).json(newSession);
});

// Get a game session by ID
app.get('/sessions/:id', (req: Request, res: Response) :any => {
  const { id } = req.params;
  const session = gameSessions[id];

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json(session);
});

// List all game sessions
app.get('/sessions', (req: Request, res: Response) => {
  const allSessions = Object.values(gameSessions);
  res.json(allSessions);
});

// Update a game session's status
app.patch('/sessions/:id/status', (req: Request, res: Response) :any => {
  const { id } = req.params;
  const { status } = req.body as { status: 'waiting' | 'active' | 'completed' };

  const session = gameSessions[id];

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  if (!['waiting', 'active', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  session.status = status;
  res.json(session);
});

// Delete a game session
app.delete('/sessions/:id', (req: Request, res: Response) :any => {
  const { id } = req.params;

  if (!gameSessions[id]) {
    return res.status(404).json({ error: 'Session not found' });
  }

  delete gameSessions[id];
  res.status(204).send();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Game Session Service is running on port ${PORT}`);
});