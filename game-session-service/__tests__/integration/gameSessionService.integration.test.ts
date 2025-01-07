import request from 'supertest';
import { app } from '../../src/index';

describe('GameSessionService Integration Tests', () => {
  let sessionId: string;

  it('should create a new game session', async () => {
    const response = await request(app)
      .post('/game-session/create')
      .send({ players: ['player1', 'player2'] });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    sessionId = response.body.id;
  });

  it('should retrieve a game session by ID', async () => {
    const response = await request(app).get(`/game-session/${sessionId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(sessionId);
  });

  it('should list all game sessions', async () => {
    const response = await request(app).get('/game-session');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should update the status of a game session', async () => {
    const response = await request(app)
      .patch(`/game-session/${sessionId}/status`)
      .send({ status: 'active' });

    expect(response.status).toBe(200);
    const sessionResponse = await request(app).get(`/game-session/${sessionId}`);
    expect(sessionResponse.body.status).toBe('active');
  });

  it('should delete a game session', async () => {
    const response = await request(app).delete(`/game-session/${sessionId}`);
    expect(response.status).toBe(204);
  });
});
