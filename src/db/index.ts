import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

dotenv.config();
const isProd = process.env.USE_PRODUCTION_DB === 'true';

const dbURL = isProd
  ? process.env.PRODUCTION_DATABASE_URL
  : process.env.DEVELOPMENT_DATABASE_URL;

console.log(`[DB] Using ${isProd ? 'Production' : 'Development'} DB`);

console.log(`[Drizzle] Using ${isProd ? 'Production' : 'Development'} DB`);
const sql = postgres(dbURL!, { max: 1 });
export const db = drizzle(sql, { schema });

async function testConnection() {
  try {
    // Use the raw sql client to run a test query
    await sql`SELECT 1+1 AS result`;
  } catch (error) {
    throw new Error('Database connection failed: ' + error);
  }
}

testConnection();
