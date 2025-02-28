import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Game Session Service API',
      version: '1.0.0',
      description: 'API for managing game sessions',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
    components: {
      // Authorize bearer token
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        GameSession: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the session',
            },
            players: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of player IDs in the session',
            },
            status: {
              type: 'string',
              enum: ['waiting', 'active', 'completed'],
              description: 'Session status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the session was created',
            },
          },
        },
        CreateGameSessionRequest: {
          type: 'object',
          properties: {
            players: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of player IDs to create a session',
            },
          },
          required: ['players'],
        },
        UpdateSessionStatusRequest: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['waiting', 'active', 'completed'],
              description: 'New status for the session',
            },
          },
          required: ['status'],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/**/*.ts'], // Path to API annotations
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);