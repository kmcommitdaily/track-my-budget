import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/db/migrations',
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  driver: 'pglite',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  verbose: true,
  strict: true,
});
