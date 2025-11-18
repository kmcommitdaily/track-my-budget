import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.USE_PRODUCTION_DB === 'true';

const dbURL = isProd ? process.env.PRODUCTION_DATABASE_URL : process.env.DEVELOPMENT_DATABASE_URL


console.log(`[Drizzle] Using ${isProd ? "Production" : "Development"} DB`);
export default defineConfig({
  out: './src/db/migrations',
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  dbCredentials: {
    url: dbURL!,
  },

  verbose: true,
  strict: true,
});
