import express from 'express';
import axios from 'axios';

import { config } from '@maorte/strategos-services-common-package/dist/config';
import { User } from '@maorte/strategos-services-common-package/dist/models/userModel';  // Reuse the User model
import { httpClient } from '@maorte/strategos-services-common-package/dist/utils/httpClient';  // Reuse Axios wrapper
import { authMiddleware } from '@maorte/strategos-services-common-package/dist/middleware/authMiddleware';

const app = express();
const port = 3000;
app.use(authMiddleware);  // Reuse in both services

app.get('/start-session', async (req, res) => {
  try {
    const response = await axios.get(config.gameSessionServiceUrl + './session');
    res.send(`Session Started: ${response.data}`);
  } catch (error) {
    res.status(500).send('Error starting session');
  }
});

app.listen(port, () => {
  console.log(`Auth Service is running at http://localhost:${port}`);
});