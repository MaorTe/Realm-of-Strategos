import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { addPlayerToQueue, findMatch } from './matchmaking';
import { assignPlayersToSession } from './sessionIntegration';

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.MATCH_PORT || 3002;

// Add player to matchmaking queue
app.post('/queue', async (req: Request, res: Response): Promise<void> => {
    const { id, skill } = req.body;
    if (!id || typeof skill !== 'number') {
        res.status(400).json({ error: 'Invalid input. Player ID and skill are required.' });
        return;
    }

    try {
        await addPlayerToQueue({ id, skill });
        res.status(200).json({ message: 'Player added to queue' });
    } catch (error) {
        console.error('Failed to add player to queue:', error);
        res.status(500).json({ error: 'Failed to add player to queue' });
    }
});

// Find a match
app.get('/match', async (_req: Request, res: Response): Promise<void> => {
    try {
        const match = await findMatch();
        if (match) {
            res.status(200).json({ match });
        } else {
            res.status(404).json({ message: 'No match found' });
        }
    } catch (error) {
        console.error('Failed to find match:', error);
        res.status(500).json({ error: 'Failed to find match' });
    }
});

// Assign matched players to a session
app.post('/assign-session', async (_req: Request, res: Response): Promise<void> => {
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
});

app.listen(port, () => {
    console.log(`Matchmaking service running on port ${port}`);
});
