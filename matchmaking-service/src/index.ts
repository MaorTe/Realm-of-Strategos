import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { addPlayerToQueue, findMatch } from './matchmaking';

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.MATCH_PORT || 3002;

type QueueResponse =
  | { error: string }
  | { message: string };

// Add player to matchmaking queue
app.post('/queue', async (req: Request, res: Response):Promise<any> => {
    const { id, skill } = req.body;
    if (!id || typeof skill !== 'number') {
        return res.status(400).json({ error: 'Invalid input. Player ID and skill are required.' });
    }

    try {
        await addPlayerToQueue({ id, skill });
        res.status(200).json({ message: 'Player added to queue' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add player to queue' });
    }
});

// Find a match
app.get('/match', async (_req: Request, res: Response) => {
    try {
        const match = await findMatch();
        if (match) {
            res.status(200).json({ match });
        } else {
            res.status(404).json({ message: 'No match found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to find match' });
    }
});

app.listen(port, () => {
    console.log(`Matchmaking service running on port ${port}`);
});