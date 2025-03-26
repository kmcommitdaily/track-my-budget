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
    .references(() => companyTable.id, { onDelete: 'cascade' })
    .notNull(),
  user_id: text()
    .references(() => user.id, { onDelete: 'cascade' }) //
    .notNull(),
  ...timestamps,
});

export const incomeTransactionsTable = pgTable(
  'income_transactions',
  {
    user_id: text()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    salary_id: uuid()
      .notNull()
      .references(() => salaryTable.id, { onDelete: 'cascade' }),
    company_id: uuid()
      .notNull()
      .references(() => companyTable.id, { onDelete: 'cascade' }),
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
  user_id: text()
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  ...timestamps,
});

export const itemsTable = pgTable('items', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  price: numeric('price', { precision: 10, scale: 2 }),
  quantity: numeric('quantity', { precision: 10, scale: 2 }),

  user_id: text()
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),

  category_id: uuid('category_id')
    .references(() => categoriesTable.id, { onDelete: 'cascade' })
    .notNull(),

  budget_id: uuid('budget_id')
    .references(() => budgetTable.id, { onDelete: 'cascade' })
    .notNull(),

  ...timestamps,
});

export const budgetTable = pgTable('budget', {
  id: uuid('id').primaryKey(),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  remaining_amount: numeric('remaining_amount', { precision: 10, scale: 2 }), // 🔶 New field
  user_id: text()
    .references(() => user.id, { onDelete: 'cascade' }) // 💥 Remove budgets when user is deleted
    .notNull(),
  category_id: uuid('category_id')
    .references(() => categoriesTable.id, { onDelete: 'cascade' })
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
