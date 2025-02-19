import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './docs/swaggerConfig';
import matchmakingRoutes from './routes/matchmakingRoutes';
import { logger } from '@maorte/strategos-services-common-package/dist/logger';
import { errorHandler } from '@maorte/strategos-services-common-package/dist/middleware';

dotenv.config();
export const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.MATCH_PORT || 3002;

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Load routes
app.use('/matchmaking', matchmakingRoutes);
// Error Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Matchmaking service running on port ${PORT}`);
  logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});