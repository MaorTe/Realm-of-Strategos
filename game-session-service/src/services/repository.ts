import { DeleteResult, UpdateResult } from "kysely";
import { database, sql } from "./kysely-config";
import { GameSession } from './types';

export class GameSessionRepository {
  
  static async createGameSession(gameSession: GameSession): Promise<GameSession> {
    return await database
      .insertInto('game_session')
      .values({ players: gameSession.players, status: gameSession.status })
      .returningAll()
      .executeTakeFirst() as GameSession;
  }

  static async getGameSession(sessionId: string): Promise<GameSession | undefined> {
    return await database
      .selectFrom('game_session')
      .selectAll()
      .where('id', '=', sessionId)
      .executeTakeFirst() as GameSession;
  }

  static async listGameSessions(): Promise<GameSession[]> {
    return await database
      .selectFrom('game_session')
      .selectAll()
      .execute() as GameSession[];
  }

  static async updateGameSessionStatus(sessionId: string, status: string): Promise<UpdateResult> {
    return await database
      .updateTable('game_session')
      .set({ status })
      .where('id', '=', sessionId)
      .executeTakeFirst();
  }

  static async deleteGameSession(sessionId: string): Promise<DeleteResult[]> {
    return await database
      .deleteFrom('game_session')
      .where('id', '=', sessionId)
      .execute();
  }
}