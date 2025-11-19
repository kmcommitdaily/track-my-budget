/**
 * Expense Repository Port
 * Interface for expense/item data access operations
 */

import type { Expense } from "../entities/expense";

export type ExpenseWithDetails = Omit<Expense, "createdAt"> & {
  itemName: string; // Alias for frontend compatibility (same as name)
  createdAt: string; // ISO string for API response
  categoryTitle: string;
  budgetAmount: string;
  remainingBudget: string;
};

export type ExpenseRepository = {
  findById: (id: string) => Promise<Expense | null>;
  findByUserId: (userId: string) => Promise<ExpenseWithDetails[]>;
  findByBudgetId: (budgetId: string) => Promise<Expense[]>;
  create: (expense: Expense) => Promise<Expense>;
  delete: (id: string, userId: string) => Promise<boolean>;
};
