//import { database, sql } from "@maorte/strategos-services-common-package/dist/database/kysely-config";
import { database, sql } from "./kysely-config";
import { Match } from "../models/match";

export const MatchmakingRepository = {
  /**
   * Save a match in the PostgreSQL database.
   * @param player1Id - The first matched player's ID.
   * @param player2Id - The second matched player's ID.
   */
   saveMatch: async (player1Id: string, player2Id: string): Promise<Match | undefined> => {
      return await database
      .insertInto('match')
      .values({
        player1_id: player1Id,
        player2_id: player2Id
      })
      .defaultValues()  // ✅ Uses DB defaults for columns with DEFAULT
      .returningAll() // ✅ Returns the generated `id`
      .executeTakeFirst();
  },

  /**
   * Fetch the last X matches from the database.
   * @param limit - Number of recent matches to retrieve.
   */
  getRecentMatches: async (limit: number = 10): Promise<Match[]> => {
    return await database
      .selectFrom("match")
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
      .deleteFrom("match")
      .where(
        sql.ref("created_at"),  // ✅ Correctly reference the column
        "<",
        sql`NOW() - INTERVAL '30 days'`)
      .execute();
  },
};
