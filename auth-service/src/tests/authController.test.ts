import { Request, Response } from 'express';
import { register, login, validate } from '../controllers/authController';

describe('authController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
    };
  });

  it('should register a new user successfully', async () => {
    mockRequest.body = { username: 'testuser', password: 'password123' };
    await register(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ message: 'User registered successfully' }));
  });

  it('should return error for duplicate user', async () => {
    mockRequest.body = { username: 'existinguser', password: 'password123' };
    await register(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ error: 'User already exists' }));
  });

  it('should validate a valid token successfully', async () => {
    mockRequest.body = { token: 'valid-jwt-token' };
    await validate(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ valid: true }));
  });

  it('should return error for an invalid token', async () => {
    mockRequest.body = { token: 'invalid-jwt-token' };
    await validate(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ valid: false }));
  });
});