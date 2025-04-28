import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

dotenv.config();

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
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
