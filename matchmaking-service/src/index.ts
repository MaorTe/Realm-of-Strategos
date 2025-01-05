import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './docs/swaggerConfig';
import matchmakingRoutes from './routes/matchmakingRoutes';

dotenv.config();
const app = express();
app.use(express.json());

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Load routes
app.use('/matchmaking', matchmakingRoutes);

const port = process.env.MATCH_PORT || 3002;
app.listen(port, () => {
  console.log(`Matchmaking service running on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});