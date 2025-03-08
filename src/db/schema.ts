import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email').unique(),
  password: varchar('password'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
