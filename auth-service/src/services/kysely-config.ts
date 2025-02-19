import { Kysely, PostgresDialect, sql } from 'kysely';
import { Pool } from 'pg';
import { DB } from '@maorte/strategos-services-common-package/dist/database/types';
import { DATABASE_URL }from '../config';

export const database = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: DATABASE_URL,
      max: 10, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    }),
  }),
});

export const getDatabaseConnection = () => {
  return database;
};

export const closeDatabaseConnection = async () => {
  await database.destroy();
};


export { sql };
