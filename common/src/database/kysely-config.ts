import { Kysely, PostgresDialect, sql } from 'kysely';
import { Pool } from 'pg';
import { DB } from './types';

export const database = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      port: parseInt(process.env.PG_PORT || '5432', 10),
      max: 10, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    }),
  }),
});

export { sql };
