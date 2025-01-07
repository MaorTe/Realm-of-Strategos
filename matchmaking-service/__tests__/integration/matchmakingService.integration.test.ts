import request from 'supertest';
import Redis from 'ioredis';
import { app } from '../../src/index'; // Assuming your Express app is exported from src/index.ts

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

jest.mock('ioredis', () => require('ioredis-mock'));

describe('Matchmaking Service Integration Tests', () => {
  beforeAll(async () => {
    await redis.flushall(); // Clear Redis before starting tests
  });

  afterAll(async () => {
    await redis.quit(); // Close Redis connection
  });

  describe('POST /matchmaking/queue', () => {
    it('should add a player to the matchmaking queue', async () => {
      const player = { id: 'player1', skill: 100 };

      const response = await request(app)
        .post('/matchmaking/queue')
        .send(player);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Player added to queue');
    });

    it('should return 400 for invalid input', async () => {
      const invalidPlayer = { skill: 100 }; // Missing 'id'

      const response = await request(app)
        .post('/matchmaking/queue')
        .send(invalidPlayer);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid input. Player ID and skill are required.');
    });
  });

  describe('GET /matchmaking/match', () => {
    it('should find a match and return players', async () => {
      const players = [
        { id: 'player1', skill: 100 },
        { id: 'player2', skill: 105 },
      ];

      // Add players to the queue
      for (const player of players) {
        await redis.zadd('matchmaking_queue', player.skill, JSON.stringify(player));
      }

      const response = await request(app).get('/matchmaking/match');

      expect(response.status).toBe(200);
      expect(response.body.match).toHaveLength(2);
      expect(response.body.match[0].id).toBe('player1');
      expect(response.body.match[1].id).toBe('player2');
    });

    it('should return 404 if no match is found', async () => {
      await redis.flushall(); // Clear the queue

      const response = await request(app).get('/matchmaking/match');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No match found');
    });
  });

  describe('POST /matchmaking/session', () => {
    it('should create a session for matched players', async () => {
      const players = [
        { id: 'player1', skill: 100 },
        { id: 'player2', skill: 105 },
      ];

      // Add players to the queue
      for (const player of players) {
        await redis.zadd('matchmaking_queue', player.skill, JSON.stringify(player));
      }

      const response = await request(app).post('/matchmaking/session');

      expect(response.status).toBe(200);
      expect(response.body.session).toHaveProperty('sessionId');
      expect(response.body.session.players).toHaveLength(2);
    });

    it('should return 404 if no match is found for session creation', async () => {
      await redis.flushall(); // Clear the queue

      const response = await request(app).post('/matchmaking/session');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No match found');
    });
  });
});
