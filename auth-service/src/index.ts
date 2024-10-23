import express from 'express';

const app = express();
const port = 3000;

app.get('/auth', (req, res) => {
  res.send('Authentication Service');
});

app.listen(port, () => {
  console.log(`Auth Service is running at http://localhost:${port}`);
});