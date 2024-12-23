import express, { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';

import { config } from '@maorte/strategos-services-common-package/dist/config';
import { User } from '@maorte/strategos-services-common-package/dist/models/userModel';  // Reuse the User model
import { httpClient } from '@maorte/strategos-services-common-package/dist/utils/httpClient';  // Reuse Axios wrapper
import { authMiddleware } from '@maorte/strategos-services-common-package/dist/middleware/authMiddleware';

const app = express();
app.use(express.json());
app.use(authMiddleware);  // Reuse in both services

const port = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Interface for decoded JWT payload
interface DecodedToken extends JwtPayload {
  id: string;
  username: string;
}

app.get('/start-session', async (req, res) => {
  try {
    const response = await axios.get(config.gameSessionServiceUrl + './session');
    res.send(`Session Started: ${response.data}`);
  } catch (error) {
    res.status(500).send('Error starting session');
  }
});

app.post('/validate-token', (req: Request, res: Response) : any => {
  const { token } = req.body;
   try {
     const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
     res.json({ valid: true, user: decoded });
   } catch (error) {
     res.status(401).json({ valid: false, message: 'Invalid token' });
   }
  return res.json();
});

app.listen(port, () => {
  console.log(`Auth Service is running at http://localhost:${port}`);
});