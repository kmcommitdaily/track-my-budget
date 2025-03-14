import { pgTable, unique, uuid, varchar, timestamp, foreignKey, numeric, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: uuid().primaryKey().notNull(),
	name: varchar({ length: 255 }),
	email: varchar(),
	password: varchar(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const budget = pgTable("budget", {
	id: uuid().primaryKey().notNull(),
	amount: numeric({ precision: 10, scale:  2 }),
	userId: uuid("user_id").notNull(),
	categoryId: uuid("category_id").notNull(),
	startDate: timestamp("start_date", { mode: 'string' }),
	endDate: timestamp("end_date", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "budget_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "budget_category_id_categories_id_fk"
		}),
]);

export const categories = pgTable("categories", {
	id: uuid().primaryKey().notNull(),
	title: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const salary = pgTable("salary", {
	id: uuid().primaryKey().notNull(),
	amount: numeric({ precision: 10, scale:  2 }),
	companyId: uuid("company_id").notNull(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "salary_company_id_company_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "salary_user_id_users_id_fk"
		}),
]);

export const company = pgTable("company", {
	id: uuid().primaryKey().notNull(),
	name: varchar({ length: 255 }),
});

export const items = pgTable("items", {
	id: uuid().primaryKey().notNull(),
	name: varchar({ length: 255 }),
	price: numeric({ precision: 10, scale:  2 }),
	quantity: numeric({ precision: 10, scale:  2 }),
	userId: uuid("user_id").notNull(),
	categoryId: uuid("category_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "items_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "items_category_id_categories_id_fk"
		}),
]);

export const incomeTransactions = pgTable("income_transactions", {
	userId: uuid("user_id").notNull(),
	salaryId: uuid("salary_id").notNull(),
	companyId: uuid("company_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "income_transactions_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.salaryId],
			foreignColumns: [salary.id],
			name: "income_transactions_salary_id_salary_id_fk"
		}),
	foreignKey({
			columns: [table.companyId],
			foreignColumns: [company.id],
			name: "income_transactions_company_id_company_id_fk"
		}),
	primaryKey({ columns: [table.userId, table.salaryId, table.companyId], name: "income_transactions_user_id_salary_id_company_id_pk"}),
]);
