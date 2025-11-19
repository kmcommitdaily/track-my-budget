/**
 * Expense Mapper
 * Maps between database models and domain entities
 */

import type { Expense } from "@/core/entities/expense";

type ExpenseRow = {
  id: string;
  name: string | null;
  price: string | null;
  quantity: string | null;
  category_id: string;
  budget_id: string;
  user_id: string;
  month: string;
  created_at: Date | null;
  updated_at: Date | null;
};

/**
 * Maps database row to domain entity
 */
export function mapExpenseToEntity(row: ExpenseRow): Expense {
  return {
    id: row.id,
    name: row.name || "",
    price: Number(row.price || 0),
    quantity: Number(row.quantity || 1),
    categoryId: row.category_id,
    budgetId: row.budget_id,
    userId: row.user_id,
    month: row.month,
    createdAt: row.created_at || new Date(),
    updatedAt: row.updated_at || new Date(),
  };
}

/**
 * Maps domain entity to database insert values
 */
export function mapExpenseToDb(entity: Expense) {
  return {
    id: entity.id,
    name: entity.name,
    price: entity.price.toFixed(2),
    quantity: entity.quantity.toFixed(2),
    category_id: entity.categoryId,
    budget_id: entity.budgetId,
    user_id: entity.userId,
    month: entity.month,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
}
