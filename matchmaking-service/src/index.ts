import * as fs from 'fs';
import express from 'express';
import { addPlayerToQueue, findMatch } from './matchmaking';

const app = express();
app.use(express.json());
const redisPort = fs.readFileSync('/run/secrets/REDIS_PORT', 'utf8').trim();
console.log('Initiated index.ts!');

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

app.listen(redisPort, () => console.log(`Matchmaking service running on port ${redisPort}`));
