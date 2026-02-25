import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';
const maxPoolSize = Number(process.env.PG_POOL_MAX) || 10;

// Use DATABASE_URL if available (Render), otherwise individual credentials
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      max: maxPoolSize,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'geethika_db',
      user: process.env.DB_USER || 'postgres',
      password: String(process.env.DB_PASSWORD || ''),
      max: maxPoolSize,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

// Simple slow-query logger (useful during optimization)
const originalQuery = pool.query.bind(pool);

pool.query = async (text, params) => {
  const start = Date.now();
  const result = await originalQuery(text, params);
  const duration = Date.now() - start;

  const threshold =
    Number(process.env.DB_SLOW_QUERY_THRESHOLD_MS) || (isProduction ? 750 : 300);

  if (duration > threshold) {
    console.warn(
      `Slow query (${duration} ms):`,
      String(text).replace(/\s+/g, ' ').slice(0, 160)
    );
  }

  return result;
};

pool.on('connect', () => {
  if (!isProduction) {
    console.log('✅ Database connected successfully');
  }
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  // Let the platform restart the process on fatal errors
  process.exit(1);
});

export const query = (text, params) => pool.query(text, params);

export default pool;
