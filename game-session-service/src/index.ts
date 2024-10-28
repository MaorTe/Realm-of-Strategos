import express from 'express';
import { createSession, getSessionById } from '../../common/src/services/sessionService';
const app = express();
const port = 3001;

app.get('/session', (req, res) => {
  res.send('Game Session Service');
});

app.listen(port, () => {
  console.log(`Game Session Service running at http://localhost:${port}`);
});