//import { database, sql } from "@maorte/strategos-services-common-package/dist/database/kysely-config";
import { database, sql } from "./kysely-config";
import { Player } from "../models/player";

export const MatchmakingRepository = {
  /**
   * Save a match in the PostgreSQL database.
   * @param players - The two matched players.
   */
  saveMatch: async (player1Id: string, player2Id: string): Promise<void> => {
      await database
      .insertInto('Match')
      .values({
        player1_id: player1Id,
        player2_id: player2Id
      })
      .defaultValues()  // ✅ Uses DB defaults for columns with DEFAULT
      .returning(['id']) // ✅ Returns the generated `id`
      .execute();
  },

  /**
   * Fetch the last X matches from the database.
   * @param limit - Number of recent matches to retrieve.
   */
  getRecentMatches: async (limit: number = 10): Promise<any[]> => {
    return await database
      .selectFrom("Match")
      .selectAll()
      .orderBy("created_at", "desc")
      .limit(limit)
      .execute();
  },

  /**
   * Delete old matches from the database (e.g., older than 30 days).
   */
  cleanupOldMatches: async (): Promise<void> => {
    await database
      .deleteFrom("Match")
      .where(
        sql.ref("created_at"),  // ✅ Correctly reference the column
        "<",
        sql`NOW() - INTERVAL '30 days'`)
      .execute();
  },
};
