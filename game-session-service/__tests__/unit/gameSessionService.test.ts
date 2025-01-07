import {
  createGameSession,
  getGameSession,
  updateGameSessionStatus,
  listGameSessions,
  deleteGameSession,
} from '../../src/services/gameSessionService';
import { GameSession } from '../../src/models/gameSession';

describe('GameSessionService', () => {
  const mockPlayerIds = ['player1', 'player2'];
  let sessionId: string;

  it('should create a new game session', async () => {
    const session: GameSession = await createGameSession(mockPlayerIds);
    sessionId = session.id;
    expect(session).toHaveProperty('id');
    expect(session.players).toEqual(mockPlayerIds);
    expect(session.status).toBe('waiting');
  });

  it('should retrieve a game session by ID',async () => {
    const session = await getGameSession(sessionId);
    expect(session).toBeDefined();
    expect(session?.id).toBe(sessionId);
  });

  it('should list all game sessions',async () => {
    const sessions = await listGameSessions();
    expect(sessions.length).toBeGreaterThan(0);
  });

  it('should update the status of a game session', async() => {
    updateGameSessionStatus(sessionId, 'active');
    const session = await getGameSession(sessionId);
    expect(session?.status).toBe('active');
  });

  it('should delete a game session',async () => {
    const result = await deleteGameSession(sessionId);
    expect(result).toBe(true);
    const session = getGameSession(sessionId);
    expect(session).toBeUndefined();
  });
});
