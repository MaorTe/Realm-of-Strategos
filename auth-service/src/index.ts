import express from 'express';
import axios from 'axios';

import config from '../../common/src/config';
import { User } from '../../common/src/models/userModel';  // Reuse the User model
import { httpClient } from '../../common/src/utils/httpClient';  // Reuse Axios wrapper
import { authMiddleware } from '../../common/src/middleware/authMiddleware';

const app = express();
const port = 3000;
app.use(authMiddleware);  // Reuse in both services

app.get('/start-session', async (req, res) => {
  try {
    const response = await axios.get('http://game-session-service:3001/session');
    res.send(`Session Started: ${response.data}`);
  } catch (error) {
    res.status(500).send('Error starting session');
  }
});

app.listen(port, () => {
  console.log(`Auth Service is running at http://localhost:${port}`);
});