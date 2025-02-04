import { database, sql } from "./kysely-config";
import { GameSession } from './types';

export class GameSessionRepository {
  
  static async createGameSession(gameSession: GameSession): Promise<void> {
    await database
      .insertInto('GameSession')
      .values({
        players: gameSession.players,
        status: gameSession.status,
      })
      .execute();
  }

  static async getGameSession(sessionId: string): Promise<GameSession | undefined> {
    return await database
      .selectFrom('GameSession')
      .selectAll()
      .where('id', '=', sessionId)
      .executeTakeFirst() as GameSession;
  }

  static async listGameSessions(): Promise<GameSession[]> {
    return await database
      .selectFrom('GameSession')
      .selectAll()
      .execute() as GameSession[];
  }

  static async updateGameSessionStatus(sessionId: string, status: string): Promise<void> {
    await database
      .updateTable('GameSession')
      .set({ status })
      .where('id', '=', sessionId)
      .execute();
  }

  static async deleteGameSession(sessionId: string): Promise<void> {
    await database
      .deleteFrom('GameSession')
      .where('id', '=', sessionId)
      .execute();
  }
}