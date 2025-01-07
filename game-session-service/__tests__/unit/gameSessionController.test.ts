import { Request, Response } from 'express';
import {
  createSession,
  retrieveSession,
  listSessions,
  updateSessionStatus,
  deleteSession,
} from '../../src/controllers/gameSessionController';
import { createGameSession } from '../../src/services/gameSessionService';

jest.mock('../../src/services/gameSessionService');

describe('GameSessionController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  it('should create a game session', () => {
    req.body = { players: ['player1', 'player2'] };
    createSession(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ players: ['player1', 'player2'] }));
  });

  it('should retrieve a game session by ID', () => {
    req.params = { id: 'mockSessionId' };
    retrieveSession(req as Request, res as Response);

    expect(res.status).not.toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalled();
  });
});
