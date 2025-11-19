/**
 * Budget Mapper
 * Maps between database models and domain entities
 */

import type { Budget } from "@/core/entities/budget";
import { calculateRemainingBudget } from "@/core/entities/budget";

type BudgetRow = {
  id: string;
  amount: string | null;
  remaining_amount: string | null;
  category_id: string;
  user_id: string;
  month: string;
  start_date: Date | null;
  end_date: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
};

/**
 * Maps database row to domain entity
 */
export function mapBudgetToEntity(
  row: BudgetRow,
  totalExpenses: number = 0
): Budget {
  const amount = Number(row.amount || 0);
  return {
    id: row.id,
    amount,
    remainingAmount: calculateRemainingBudget(amount, totalExpenses),
    categoryId: row.category_id,
    userId: row.user_id,
    month: row.month,
    startDate: row.start_date || undefined,
    endDate: row.end_date || undefined,
    createdAt: row.created_at || new Date(),
    updatedAt: row.updated_at || new Date(),
  };
}

/**
 * Maps domain entity to database insert values
 */
export function mapBudgetToDb(entity: Budget) {
  return {
    id: entity.id,
    amount: entity.amount.toString(),
    category_id: entity.categoryId,
    user_id: entity.userId,
    month: entity.month,
    start_date: entity.startDate || null,
    end_date: entity.endDate || null,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
}
