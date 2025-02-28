import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Matchmaking Service API',
      version: '1.0.0',
      description: 'API for managing player matchmaking and game session creation',
    },
    servers: [
      {
        url: 'http://localhost:3002',
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
        Player: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the player',
            },
            skill: {
              type: 'number',
              description: 'Skill level of the player',
            },
            timestamp: {
              type: 'integer',
              format: 'int64',
              description: 'Time the player was added to the matchmaking queue',
            },
          },
        },
        GameSession: {
          type: 'object',
          properties: {
            sessionId: {
              type: 'string',
              description: 'Unique identifier for the game session',
            },
            players: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Player',
              },
              description: 'Players assigned to the game session',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Time the game session was created',
            },
          },
        },
        QueueRequest: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the player',
            },
            skill: {
              type: 'number',
              description: 'Skill level of the player',
            },
          },
          required: ['id', 'skill'],
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