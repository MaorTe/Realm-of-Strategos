import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './docs/swaggerConfig';
import matchmakingRoutes from './routes/matchmakingRoutes';
import logger from '@maorte/strategos-services-common-package/dist/utils/logger';

dotenv.config();
const app = express();
app.use(express.json());

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Load routes
app.use('/matchmaking', matchmakingRoutes);

const port = process.env.MATCH_PORT || 3002;
app.listen(port, () => {
  logger.info(`Matchmaking service running on port ${port}`);
  logger.info(`Swagger docs available at http://localhost:${port}/api-docs`);
});