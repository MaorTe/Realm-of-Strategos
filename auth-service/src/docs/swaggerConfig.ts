import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Service API',
      version: '1.0.0',
      description: 'API for user authentication and session management',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the user',
            },
            username: {
              type: 'string',
              description: 'Username of the user',
            },
            email: {
              type: 'string',
              description: 'Email of the user (optional)',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of user creation',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Username of the user',
            },
            password: {
              type: 'string',
              description: 'Password of the user',
            },
          },
          required: ['username', 'password'],
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT token for authentication',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/**/*.ts'], // Path to the API annotations
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);