import {
  numeric,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
  text,
  boolean,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const timestamps = {
  updated_at: timestamp().defaultNow(),
  created_at: timestamp().defaultNow().notNull(),
};

/** Better Auth Required User */
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const companyTable = pgTable('company', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }),
});

export const salaryTable = pgTable('salary', {
  id: uuid('id').primaryKey(),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  company_id: uuid()
    .references(() => companyTable.id)
    .notNull(),
  user_id: text()
    .references(() => user.id)
    .notNull(),
  ...timestamps,
});

export const incomeTransactionsTable = pgTable(
  'income_transactions',
  {
    user_id: text()
      .references(() => user.id)
      .notNull(),
    salary_id: uuid()
      .references(() => salaryTable.id)
      .notNull(),
    company_id: uuid()
      .references(() => companyTable.id)
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.user_id, table.salary_id, table.company_id],
    }),
  ]
);

export const categoriesTable = pgTable('categories', {
  id: uuid('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  ...timestamps,
});

export const itemsTable = pgTable('items', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  price: numeric('price', { precision: 10, scale: 2 }),
  quantity: numeric('quantity', { precision: 10, scale: 2 }),
  user_id: text()
    .references(() => user.id)
    .notNull(),
  category_id: uuid('category_id')
    .references(() => categoriesTable.id)
    .notNull(),
  budget_id: uuid('budget_id') // 🔶 New field to track spending against budgets
    .references(() => budgetTable.id),
  ...timestamps,
});

export const budgetTable = pgTable('budget', {
  id: uuid('id').primaryKey(),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  remaining_amount: numeric('remaining_amount', { precision: 10, scale: 2 }) // 🔶 New field
    .default(sql`amount`), // Start with full budget
  user_id: text()
    .references(() => user.id)
    .notNull(),
  category_id: uuid('category_id')
    .references(() => categoriesTable.id)
    .notNull(),
  start_date: timestamp('start_date'),
  end_date: timestamp('end_date'),
  ...timestamps,
});

/** For Better Auth Required Table */
export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});
