import "./config";
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './docs/swaggerConfig';
import authRoutes from './routes/authRoutes';
import { logger } from '@maorte/strategos-services-common-package/dist/logger';
import { errorHandler } from './middlewares/errorMiddleware';


export const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Load routes with base path
app.use('/auth', authRoutes);
// Error Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Auth Service is running at http://localhost:${PORT}`);
  logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});