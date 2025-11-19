/**
 * Budget Repository Port
 * Interface for budget data access operations
 */

import type { Budget } from "../entities/budget";

export type BudgetWithCategory = {
  id: string;
  amount: string;
  remainingAmount: string;
  categoryId: string;
  userId: string;
  month: string;
  categoryTitle: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BudgetRepository = {
  findById: (id: string) => Promise<Budget | null>;
  findByUserId: (
    userId: string,
    month?: string
  ) => Promise<BudgetWithCategory[]>;
  findByCategoryId: (categoryId: string) => Promise<Budget | null>;
  create: (budget: Budget) => Promise<Budget>;
  update: (budget: Budget) => Promise<Budget>;
  delete: (id: string, userId: string) => Promise<boolean>;
};
