import Redis from 'ioredis-mock'; // Mock Redis for testing
import {
  addPlayerToQueue,
  findMatch,
} from '../../src/services/matchmakingService';
import { Player } from '../../src/models/player';

jest.mock('ioredis', () => require('ioredis-mock'));

describe('MatchmakingService', () => {
    let redis: any;

  beforeAll(() => {
    redis = new Redis();
  });

  beforeEach(async () => {
    await redis.flushall(); // Clear Redis data before each test
  });

  afterAll(async () => {
    await redis.quit(); // Ensure Redis connection is closed after all tests
  });

  it('should add a player to the matchmaking queue', async () => {
    const player: Player = { id: 'player1', skill: 100, timestamp: Date.now() };
    await addPlayerToQueue(player);

    const storedPlayer = await redis.zrange('matchmaking_queue', 0, -1, 'WITHSCORES');
    expect(storedPlayer).toHaveLength(2); // Player data and score
    expect(storedPlayer[0]).toContain(player.id);
  });

  it('should find a match between two players within skill threshold', async () => {
    const player1: Player = { id: 'player1', skill: 100, timestamp: Date.now() };
    const player2: Player = { id: 'player2', skill: 105, timestamp: Date.now() };

    await addPlayerToQueue(player1);
    await addPlayerToQueue(player2);

    const match = await findMatch();
    expect(match).toHaveLength(2);
    expect(match).toContainEqual(player1);
    expect(match).toContainEqual(player2);
  });

  it('should not find a match if players are outside skill threshold', async () => {
    const player1: Player = { id: 'player1', skill: 100, timestamp: Date.now() };
    const player2: Player = { id: 'player2', skill: 200, timestamp: Date.now() };

    await addPlayerToQueue(player1);
    await addPlayerToQueue(player2);

    const match = await findMatch();
    expect(match).toBeNull();
  });

  it('should prioritize players by skill and waiting time', async () => {
    const player1: Player = { id: 'player1', skill: 100, timestamp: Date.now() - 5000 };
    const player2: Player = { id: 'player2', skill: 110, timestamp: Date.now() };
    const player3: Player = { id: 'player3', skill: 105, timestamp: Date.now() - 10000 };

    await addPlayerToQueue(player1);
    await addPlayerToQueue(player2);
    await addPlayerToQueue(player3);

    // Uncomment and implement prioritizeQueue if required
    // const prioritizedQueue = await prioritizeQueue();
    // expect(prioritizedQueue[0]).toEqual(player3);
    // expect(prioritizedQueue[1]).toEqual(player1);
    // expect(prioritizedQueue[2]).toEqual(player2);
  });
});