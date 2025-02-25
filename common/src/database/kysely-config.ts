import { Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { DB } from "./types";


export function createDatabase(connectionString: string) {
  return new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString,
        max: 10, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      }),
    }),
  });
}
export { sql };
