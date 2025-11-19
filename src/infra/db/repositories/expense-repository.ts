/**
 * Expense Repository Implementation
 * Implements ExpenseRepository port using Drizzle ORM
 */

import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import type {
  ExpenseRepository,
  ExpenseWithDetails,
} from "@/core/ports/expense-repository";
import type { Expense } from "@/core/entities/expense";
import { mapExpenseToEntity, mapExpenseToDb } from "../mappers/expense-mapper";

/**
 * Creates an expense repository instance
 */
export function createExpenseRepository(): ExpenseRepository {
  return {
    findById: async (id: string): Promise<Expense | null> => {
      const [row] = await db
        .select()
        .from(schema.itemsTable)
        .where(eq(schema.itemsTable.id, id))
        .limit(1);

      return row ? mapExpenseToEntity(row) : null;
    },

    findByUserId: async (userId: string): Promise<ExpenseWithDetails[]> => {
      const rows = await db
        .select({
          id: schema.itemsTable.id,
          itemName: schema.itemsTable.name,
          price: schema.itemsTable.price,
          categoryId: schema.itemsTable.category_id,
          createdAt: schema.itemsTable.created_at,
          budgetId: schema.itemsTable.budget_id,
          budgetAmount: schema.budgetTable.amount,
          remainingBudget: sql`
            ${schema.budgetTable.amount} - COALESCE((
              SELECT SUM(${schema.itemsTable.price})
              FROM ${schema.itemsTable}
              WHERE ${schema.itemsTable.budget_id} = ${schema.budgetTable.id}
            ), 0)
          `.as("remainingBudget"),
          categoryTitle: schema.categoriesTable.title,
          month: schema.itemsTable.month,
          quantity: schema.itemsTable.quantity,
          userId: schema.itemsTable.user_id,
          updatedAt: schema.itemsTable.updated_at,
        })
        .from(schema.itemsTable)
        .innerJoin(
          schema.budgetTable,
          eq(schema.itemsTable.budget_id, schema.budgetTable.id)
        )
        .innerJoin(
          schema.categoriesTable,
          eq(schema.itemsTable.category_id, schema.categoriesTable.id)
        )
        .where(eq(schema.itemsTable.user_id, userId));

      return rows.map((row) => {
        const createdAt = row.createdAt || new Date();
        return {
          id: row.id,
          name: row.itemName || "",
          itemName: row.itemName || "", // Alias for frontend compatibility
          price: Number(row.price || 0),
          quantity: Number(row.quantity || 1),
          categoryId: row.categoryId,
          budgetId: row.budgetId,
          userId: row.userId,
          month: row.month,
          createdAt:
            createdAt instanceof Date ? createdAt.toISOString() : createdAt,
          updatedAt: row.updatedAt || new Date(),
          categoryTitle: row.categoryTitle || "",
          budgetAmount: row.budgetAmount || "0",
          remainingBudget: String(row.remainingBudget || 0),
        };
      });
    },

    findByBudgetId: async (budgetId: string): Promise<Expense[]> => {
      const rows = await db
        .select()
        .from(schema.itemsTable)
        .where(eq(schema.itemsTable.budget_id, budgetId));

      return rows.map(mapExpenseToEntity);
    },

    create: async (expense: Expense): Promise<Expense> => {
      const [row] = await db
        .insert(schema.itemsTable)
        .values(mapExpenseToDb(expense))
        .returning();

      if (!row) {
        throw new Error("Failed to create expense");
      }

      return mapExpenseToEntity(row);
    },

    delete: async (id: string, userId: string): Promise<boolean> => {
      await db
        .delete(schema.itemsTable)
        .where(
          and(
            eq(schema.itemsTable.id, id),
            eq(schema.itemsTable.user_id, userId)
          )
        );
      return true;
    },
  };
}
