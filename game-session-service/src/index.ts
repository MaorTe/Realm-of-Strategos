import express from 'express';
import { createSession , getSessionById} from '@maorte/strategos-services-common-package/dist/services/sessionService'; 
const app = express();
const port = 3001;

app.get('/session', (req, res):any => {
  res.send('Game Session Service');
});

app.listen(port, ():any => {
  console.log(`Game Session Service running at http://localhost:${port}`);
});