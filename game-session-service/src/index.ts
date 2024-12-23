import express, { Request, Response } from 'express';
import {
    createGameSession,
    getGameSession,
    updateGameSessionStatus,
    listGameSessions,
    deleteGameSession,
} from './services/gameSessionManager';

const app = express();
app.use(express.json());

// Create a new game session
app.post('/sessions', (req: Request, res: Response):any => {
    const { players } = req.body;
    if (!Array.isArray(players) || players.some((p: any) => typeof p !== 'string')) {
        return res.status(400).json({ error: 'Invalid players array' });
    }

    const newSession = createGameSession(players);
    res.status(201).json(newSession);
});

// Get a game session by ID
app.get('/sessions/:id', (req: Request, res: Response):any => {
    const { id } = req.params;
    const session = getGameSession(id);

    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
});

// List all game sessions
app.get('/sessions', (_req: Request, res: Response) => {
    const allSessions = listGameSessions();
    res.json(allSessions);
});

// Update a game session's status
app.patch('/sessions/:id/status', (req: Request, res: Response):any => {
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

// Delete a game session
app.delete('/sessions/:id', (req: Request, res: Response):any => {
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