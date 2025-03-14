import { relations } from "drizzle-orm/relations";
import { users, budget, categories, company, salary, items, incomeTransactions } from "./schema";

export const budgetRelations = relations(budget, ({one}) => ({
	user: one(users, {
		fields: [budget.userId],
		references: [users.id]
	}),
	category: one(categories, {
		fields: [budget.categoryId],
		references: [categories.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	budgets: many(budget),
	salaries: many(salary),
	items: many(items),
	incomeTransactions: many(incomeTransactions),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	budgets: many(budget),
	items: many(items),
}));

export const salaryRelations = relations(salary, ({one, many}) => ({
	company: one(company, {
		fields: [salary.companyId],
		references: [company.id]
	}),
	user: one(users, {
		fields: [salary.userId],
		references: [users.id]
	}),
	incomeTransactions: many(incomeTransactions),
}));

export const companyRelations = relations(company, ({many}) => ({
	salaries: many(salary),
	incomeTransactions: many(incomeTransactions),
}));

export const itemsRelations = relations(items, ({one}) => ({
	user: one(users, {
		fields: [items.userId],
		references: [users.id]
	}),
	category: one(categories, {
		fields: [items.categoryId],
		references: [categories.id]
	}),
}));

export const incomeTransactionsRelations = relations(incomeTransactions, ({one}) => ({
	user: one(users, {
		fields: [incomeTransactions.userId],
		references: [users.id]
	}),
	salary: one(salary, {
		fields: [incomeTransactions.salaryId],
		references: [salary.id]
	}),
	company: one(company, {
		fields: [incomeTransactions.companyId],
		references: [company.id]
	}),
}));