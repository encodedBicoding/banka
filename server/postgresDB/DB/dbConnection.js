import { Pool } from 'pg';
import { config } from 'dotenv';
import debug from 'debug';

const logger = debug('bankaDB');

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
pool.on('connect', (err) => {
  logger('connected');
  if (err) {
    logger('Error:', err);
  }
});

export default pool;
