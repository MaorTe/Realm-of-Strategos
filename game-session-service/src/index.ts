import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './docs/swaggerConfig';
import gameSessionRoutes from './routes/gameSessionRoutes';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Load routes
app.use('/game-session', gameSessionRoutes);

app.listen(PORT, () => {
  console.log(`Game Session Service is running on port ${PORT}`);
});