import { relations } from 'drizzle-orm';
import {
  budgetTable,
  categoriesTable,
  companyTable,
  incomeTransactionsTable,
  itemsTable,
  salaryTable,
  appUsersTable,
} from './schema';

export const usersRelations = relations(appUsersTable, ({ many }) => ({
  salaries: many(salaryTable),
  items: many(itemsTable),
  budgets: many(budgetTable),
  incomeTransactions: many(incomeTransactionsTable),
}));

export const companyRelations = relations(companyTable, ({ many }) => ({
  salaries: many(salaryTable),
  incomeTransactionsTable: many(incomeTransactionsTable),
}));

export const salaryRelations = relations(salaryTable, ({ one, many }) => ({
  user: one(appUsersTable, {
    fields: [salaryTable.user_id],
    references: [appUsersTable.id],
  }),
  company: one(companyTable, {
    fields: [salaryTable.company_id],
    references: [companyTable.id],
  }),
  incomeTransactions: many(incomeTransactionsTable),
}));

export const incomeTransactionsRelations = relations(
  incomeTransactionsTable,
  ({ one }) => ({
    user: one(appUsersTable, {
      fields: [incomeTransactionsTable.user_id],
      references: [appUsersTable.id],
    }),
    salary: one(salaryTable, {
      fields: [incomeTransactionsTable.salary_id],
      references: [salaryTable.id],
    }),
    company: one(companyTable, {
      fields: [incomeTransactionsTable.company_id],
      references: [companyTable.id],
    }),
  })
);

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  items: many(itemsTable),
  budgets: many(budgetTable),
}));

export const itemsRelations = relations(itemsTable, ({ one }) => ({
  user: one(appUsersTable, {
    fields: [itemsTable.user_id],
    references: [appUsersTable.id],
  }),
  category: one(categoriesTable, {
    fields: [itemsTable.category_id],
    references: [categoriesTable.id],
  }),
}));

export const budgetRelations = relations(budgetTable, ({ one }) => ({
  user: one(appUsersTable, {
    fields: [budgetTable.user_id],
    references: [appUsersTable.id],
  }),
  category: one(categoriesTable, {
    fields: [budgetTable.category_id],
    references: [categoriesTable.id],
  }),
}));
