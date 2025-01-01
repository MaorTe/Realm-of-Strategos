import {
   createGameSession,
   getGameSession,
   updateGameSessionStatus,
   listGameSessions,
   deleteGameSession,
} from './services/gameSessionManager';
import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

// **1. Create a new game session**
app.post('/game-session/create', (req: Request, res: Response): any => {
    const { players } = req.body;
    if (!Array.isArray(players) || players.some((p: any) => typeof p !== 'string')) {
        return res.status(400).json({ error: 'Invalid players array' });
    }

    const newSession = createGameSession(players);
    res.status(201).json(newSession);
});

// **2. Retrieve details of a specific session**
app.get('/game-session/:id', (req: Request, res: Response): any => {
    const { id } = req.params;
    const session = getGameSession(id);

    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
});

// **3. List all game sessions**
app.get('/game-session', (_req: Request, res: Response) => {
    const allSessions = listGameSessions();
    res.json(allSessions);
});

// **4. Update the status of a session**
app.patch('/game-session/:id/status', (req: Request, res: Response): any => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['waiting', 'active', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        updateGameSessionStatus(id, status);
        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        res.status(404).json({ error: 'Session not found' });
    }
});

// **5. Delete a game session**
app.delete('/game-session/:id', (req: Request, res: Response): any => {
    const { id } = req.params;

    const deleted = deleteGameSession(id);
    if (!deleted) {
        return res.status(404).json({ error: 'Session not found' });
    }

    res.status(204).send();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Game Session Service is running on port ${PORT}`);
});