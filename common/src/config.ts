import dotenv from 'dotenv';
dotenv.config();

export const config = {
    authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
    gameSessionServiceUrl: process.env.GAME_SESSION_SERVICE_URL || 'http://localhost:3001',
  };