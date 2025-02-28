import { DATABASE_URL } from "../config";
import { createDatabase, Match, sql } from '@maorte/strategos-services-common-package/dist';

const database = createDatabase(DATABASE_URL);

export const MatchmakingRepository = {
  /**
   * Save a match in the PostgreSQL database.
   * @param player1Id - The first matched player's ID.
   * @param player2Id - The second matched player's ID.
   */
   saveMatch: async (player1_id: string , player2_id: string): Promise<Match> => {
      return await database
      .insertInto('match')
      .values({
        player1_id,
        player2_id
      })
      .defaultValues()  // ✅ Uses DB defaults for columns with DEFAULT
      .returningAll() // ✅ Returns the generated `id`
      .executeTakeFirst() as Match;
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
      .execute() as Match[];
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
