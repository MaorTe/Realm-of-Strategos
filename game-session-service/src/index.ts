import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './docs/swaggerConfig';
import gameSessionRoutes from './routes/gameSessionRoutes';
import { startGameSessionConsumer } from './consumers/gameSessionConsumer';
import { logger } from '@maorte/strategos-services-common-package/dist/logger';
import { errorHandler } from '@maorte/strategos-services-common-package/dist/middleware';

export const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3001;

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Load routes
app.use('/game-session', gameSessionRoutes);
// Error Middleware
app.use(errorHandler);

// Start RabbitMQ consumer
startGameSessionConsumer().catch((error) => {
  console.error('Failed to start game session consumer:', error);
});

app.listen(PORT, () => {
  logger.info(`Game Session Service is running on port ${PORT}`);
  logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});