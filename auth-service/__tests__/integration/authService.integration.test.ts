import request from 'supertest';
import { app } from '../../src/index'; // Import the app instance
import { describe, it } from 'node:test';

describe('AuthService Integration Tests', () => {
  it('should register a user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
  });

  it('should return an error for duplicate registration', async () => {
    await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'password123' });

    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('User already exists');
  });

  it('should validate a user token', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    const token = loginResponse.body.token;

    const validateResponse = await request(app)
      .get('/auth/validate')
      .send({ token });

    expect(validateResponse.status).toBe(200);
    expect(validateResponse.body.valid).toBe(true);
  });
});