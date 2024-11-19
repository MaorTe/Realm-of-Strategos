import express from 'express';
import dotenv from 'dotenv';
import { addPlayerToQueue, findMatch } from './matchmaking';

dotenv.config();
const app = express();
app.use(express.json());

// Add player to matchmaking queue
app.post('/queue', async (req, res) => {
  const { id, skill } = req.body;
  await addPlayerToQueue({ id, skill });
  res.status(200).json({ message: 'Player added to queue' });
});

// Find a match
app.get('/match', async (req, res) => {
  const match = await findMatch();
  if (match) {
    res.status(200).json({ match });
  } else {
    res.status(404).json({ message: 'No match found' });
  }
});

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Matchmaking service running on port ${port}`));