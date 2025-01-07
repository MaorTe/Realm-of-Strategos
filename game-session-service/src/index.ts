import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './docs/swaggerConfig';
import gameSessionRoutes from './routes/gameSessionRoutes';
import { startGameSessionConsumer } from './consumers/gameSessionConsumer';
import logger from '@maorte/strategos-services-common-package/dist/utils/logger';

export const app = express();
app.use(express.json());


// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Load routes
app.use('/game-session', gameSessionRoutes);

// Start RabbitMQ consumer
startGameSessionConsumer().catch((error) => {
  console.error('Failed to start game session consumer:', error);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Game Session Service is running on port ${PORT}`);
  logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});