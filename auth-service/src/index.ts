import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './docs/swaggerConfig';
import authRoutes from './routes/authRoutes';
import logger from '@maorte/strategos-services-common-package/dist/utils/logger';

export const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Load routes with base path
app.use('/auth', authRoutes);
// Error Middleware
// app.use(errorMiddleware);

app.listen(PORT, () => {
  logger.info(`Auth Service is running at http://localhost:${PORT}`);
  logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});