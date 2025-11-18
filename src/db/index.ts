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

// async function testBranchIsolation() {
//   try {
//     // Create a simple test table if it doesn't exist
//     await sql`CREATE TABLE IF NOT EXISTS test_branch (id SERIAL PRIMARY KEY, label TEXT);`;

//     // Insert a unique record
//     await sql`INSERT INTO test_branch (label) VALUES ('from development branch');`;

//     console.log('✅ Inserted test record into test_branch table');
//   } catch (error) {
//     console.error('❌ Failed to insert test data:', error);
//   }
// }

// testBranchIsolation();


async function testConnection() {
  try {
    // Use the raw sql client to run a test query
    await sql`SELECT 1+1 AS result`;
  } catch (error) {
    throw new Error('Database connection failed: ' + error);
  }
}

testConnection();