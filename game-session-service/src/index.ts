import {
   createSession,
   getSessionById,
} from '@maorte/strategos-services-common-package/dist/services/sessionService';
import {
   createGameSession,
   getGameSession,
   updateGameSessionStatus,
   listGameSessions,
} from './services/gameSessionManager';
import express, { Request, Response } from 'express';
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
<<<<<<< HEAD
app.get('/sessions/:id', (req: Request, res: Response) :any => {
  const { id } = req.params;
  const session = gameSessions[id];
=======
app.get('/sessions/:id', (req: Request, res: Response): any => {
   const { id } = req.params;
   const session = gameSessions[id];
>>>>>>> 35abc87ae56a254f1fd1bb195cdff6360b3901ce

   if (!session) {
      return res.status(404).json({ error: 'Session not found' });
   }

   return res.json(session);
});

// // List all game sessions
app.get('/sessions', (req: Request, res: Response) => {
   const allSessions = Object.values(gameSessions);
   res.json(allSessions);
});

<<<<<<< HEAD
// Update a game session's status
app.patch('/sessions/:id/status', (req: Request, res: Response) :any => {
  const { id } = req.params;
  const { status } = req.body as { status: 'waiting' | 'active' | 'completed' };
=======
// // Update a game session's status
app.patch('/sessions/:id/status', (req: Request, res: Response): any => {
   const { id } = req.params;
   const { status } = req.body as { status: 'waiting' | 'active' | 'completed' };
>>>>>>> 35abc87ae56a254f1fd1bb195cdff6360b3901ce

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

<<<<<<< HEAD
// Delete a game session
app.delete('/sessions/:id', (req: Request, res: Response) :any => {
  const { id } = req.params;
=======
// // Delete a game session
app.delete('/sessions/:id', (req: Request, res: Response): any => {
   const { id } = req.params;
>>>>>>> 35abc87ae56a254f1fd1bb195cdff6360b3901ce

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
