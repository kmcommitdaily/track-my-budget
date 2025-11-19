/**
 * Budget Repository Implementation
 * Implements BudgetRepository port using Drizzle ORM
 */

import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import type {
  BudgetRepository,
  BudgetWithCategory,
} from "@/core/ports/budget-repository";
import type { Budget } from "@/core/entities/budget";
import { mapBudgetToEntity, mapBudgetToDb } from "../mappers/budget-mapper";

/**
 * Creates a budget repository instance
 */
export function createBudgetRepository(): BudgetRepository {
  return {
    findById: async (id: string): Promise<Budget | null> => {
      const [row] = await db
        .select()
        .from(schema.budgetTable)
        .where(eq(schema.budgetTable.id, id))
        .limit(1);

      if (!row) return null;

      // Calculate total expenses for this budget
      const expensesResult = await db
        .select({
          total: sql<number>`COALESCE(SUM(${schema.itemsTable.price}), 0)`,
        })
        .from(schema.itemsTable)
        .where(eq(schema.itemsTable.budget_id, id));

      const totalExpenses = Number(expensesResult[0]?.total || 0);
      return mapBudgetToEntity(row, totalExpenses);
    },

    findByUserId: async (
      userId: string,
      month?: string
    ): Promise<BudgetWithCategory[]> => {
      // Build the remaining amount calculation with optional month filter for expenses
      const remainingAmountSql = month
        ? sql`
            ${schema.budgetTable.amount} - COALESCE((
              SELECT SUM(${schema.itemsTable.price})
              FROM ${schema.itemsTable}
              WHERE ${schema.itemsTable.budget_id} = ${schema.budgetTable.id}
                AND ${schema.itemsTable.month} = ${month}
            ), 0)
          `
        : sql`
            ${schema.budgetTable.amount} - COALESCE((
              SELECT SUM(${schema.itemsTable.price})
              FROM ${schema.itemsTable}
              WHERE ${schema.itemsTable.budget_id} = ${schema.budgetTable.id}
            ), 0)
          `;

      const rows = await db
        .select({
          id: schema.budgetTable.id,
          amount: schema.budgetTable.amount,
          categoryTitle: schema.categoriesTable.title,
          categoryId: schema.budgetTable.category_id,
          remainingAmount: remainingAmountSql.as("remaining_amount"),
          month: schema.budgetTable.month,
        })
        .from(schema.budgetTable)
        .innerJoin(
          schema.categoriesTable,
          eq(schema.categoriesTable.id, schema.budgetTable.category_id)
        )
        .where(
          month
            ? and(
                eq(schema.budgetTable.user_id, userId),
                eq(schema.budgetTable.month, month)
              )
            : eq(schema.budgetTable.user_id, userId)
        );

      return rows.map((row) => ({
        id: row.id,
        amount: String(row.amount || 0),
        remainingAmount: String(row.remainingAmount || 0),
        categoryId: row.categoryId,
        userId,
        month: row.month,
        categoryTitle: row.categoryTitle || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    },

    findByCategoryId: async (categoryId: string): Promise<Budget | null> => {
      const [row] = await db
        .select()
        .from(schema.budgetTable)
        .where(eq(schema.budgetTable.category_id, categoryId))
        .limit(1);

      if (!row) return null;

      // Calculate total expenses for this budget
      const expensesResult = await db
        .select({
          total: sql<number>`COALESCE(SUM(${schema.itemsTable.price}), 0)`,
        })
        .from(schema.itemsTable)
        .where(eq(schema.itemsTable.budget_id, row.id));

      const totalExpenses = Number(expensesResult[0]?.total || 0);
      return mapBudgetToEntity(row, totalExpenses);
    },

    create: async (budget: Budget): Promise<Budget> => {
      const [row] = await db
        .insert(schema.budgetTable)
        .values(mapBudgetToDb(budget))
        .returning();

      if (!row) {
        throw new Error("Failed to create budget");
      }

      return mapBudgetToEntity(row, 0);
    },

    update: async (budget: Budget): Promise<Budget> => {
      const [row] = await db
        .update(schema.budgetTable)
        .set({
          amount: budget.amount.toString(),
          updated_at: new Date(),
        })
        .where(eq(schema.budgetTable.id, budget.id))
        .returning();

      if (!row) {
        throw new Error("Failed to update budget");
      }

      // Calculate total expenses
      const expensesResult = await db
        .select({
          total: sql<number>`COALESCE(SUM(${schema.itemsTable.price}), 0)`,
        })
        .from(schema.itemsTable)
        .where(eq(schema.itemsTable.budget_id, budget.id));

      const totalExpenses = Number(expensesResult[0]?.total || 0);
      return mapBudgetToEntity(row, totalExpenses);
    },

    delete: async (id: string, userId: string): Promise<boolean> => {
      await db
        .delete(schema.budgetTable)
        .where(
          and(
            eq(schema.budgetTable.id, id),
            eq(schema.budgetTable.user_id, userId)
          )
        );
      return true;
    },
  };
}
