import {
  numeric,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

const timestamps = {
  updated_at: timestamp().defaultNow(),
  created_at: timestamp().defaultNow().notNull(),
};

export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email').unique(),
  password: varchar('password'),
  ...timestamps,
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
  user_id: uuid()
    .references(() => usersTable.id)
    .notNull(),
  ...timestamps,
});

export const incomeTransactionsTable = pgTable(
  'income_transactions',
  {
    user_id: uuid()
      .references(() => usersTable.id)
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
  user_id: uuid()
    .references(() => usersTable.id)
    .notNull(),
  category_id: uuid('category_id')
    .references(() => categoriesTable.id)
    .notNull(),
  ...timestamps,
});

export const budgetTable = pgTable('budget', {
  id: uuid('id').primaryKey(),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  user_id: uuid()
    .references(() => usersTable.id)
    .notNull(),
  category_id: uuid('category_id')
    .references(() => categoriesTable.id)
    .notNull(),
  start_date: timestamp('start_date'),
  end_date: timestamp('end_date'),
  ...timestamps,
});
