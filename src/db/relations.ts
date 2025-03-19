 import { relations } from 'drizzle-orm';
import {
  budgetTable,
  categoriesTable,
  companyTable,
  incomeTransactionsTable,
  itemsTable,
  salaryTable,
  user,
} from './schema';

export const usersRelations = relations(user, ({ many }) => ({
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
  user: one(user, {
    fields: [salaryTable.user_id],
    references: [user.id],
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
    user: one(user, {
      fields: [incomeTransactionsTable.user_id],
      references: [user.id],
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
  user: one(user, {
    fields: [itemsTable.user_id],
    references: [user.id],
  }),
  category: one(categoriesTable, {
    fields: [itemsTable.category_id],
    references: [categoriesTable.id],
  }),
  budget: one(budgetTable, {
    // ✅ New relation
    fields: [itemsTable.budget_id],
    references: [budgetTable.id],
  }),
}));

export const budgetRelations = relations(budgetTable, ({ one, many }) => ({
  user: one(user, {
    fields: [budgetTable.user_id],
    references: [user.id],
  }),
  category: one(categoriesTable, {
    fields: [budgetTable.category_id],
    references: [categoriesTable.id],
  }),
  items: many(itemsTable), // ✅ New relation (Budget → Expenses)
}));

