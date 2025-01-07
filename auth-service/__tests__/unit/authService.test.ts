import { registerUser, loginUser, validateToken } from '../../src/services/authService';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  describe('registerUser', () => {
    it('should register a user successfully', async () => {
      const username = 'testuser';
      const password = 'password123';
      const result = await registerUser(username, password);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          username,
        })
      );
    });

    it('should throw an error if username or password is missing', async () => {
      await expect(registerUser('', 'password123')).rejects.toThrow(
        'Username and password are required'
      );
    });
  });

  describe('loginUser', () => {
    it('should login a user and return a token', async () => {
      const username = 'testuser';
      const password = 'password123';
      const mockToken = 'mocked.jwt.token';
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await loginUser(username, password);

      expect(result).toEqual(mockToken);
    });

    it('should throw an error for invalid credentials', async () => {
      await expect(loginUser('invaliduser', 'wrongpassword')).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });

  describe('validateToken', () => {
    it('should validate a token and return the decoded payload', async () => {
      const mockPayload = { id: '123', username: 'testuser' };
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      const result = await validateToken('mocked.jwt.token');

      expect(result).toEqual(mockPayload);
    });

    it('should throw an error for an invalid token', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(validateToken('invalid.token')).rejects.toThrow(
        'Invalid token'
      );
    });
  });
});