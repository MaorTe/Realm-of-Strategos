import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from '../logger/logger';

// Load environment variables
dotenv.config();

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'password',
  database: process.env.PG_DB || 'game_sessions',
  port: parseInt(process.env.PG_PORT || '5432', 10),
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
});

pool.on('connect', () => logger.info('Connected to PostgreSQL'));
pool.on('error', (err) => logger.error('PostgreSQL connection error:', err));

// Query helper
export const query = async (text: string, params?: any[]): Promise<any> => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } catch (error) {
    logger.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const closePool = async (): Promise<void> => {
  await pool.end();
  logger.info('PostgreSQL connection pool closed');
};

export default pool;