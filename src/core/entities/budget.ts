/**
 * Budget Entity
 * Pure business logic for budget domain model
 */

export type Budget = {
  id: string;
  amount: number;
  remainingAmount: number;
  categoryId: string;
  userId: string;
  month: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Creates a new budget entity
 */
export function createBudget(
  amount: number,
  categoryId: string,
  userId: string,
  month: string,
  startDate?: Date,
  endDate?: Date
): Budget {
  if (amount <= 0) {
    throw new Error("Budget amount must be greater than 0");
  }
  if (!categoryId?.trim()) {
    throw new Error("Category ID is required");
  }
  if (!userId?.trim()) {
    throw new Error("User ID is required");
  }
  if (!month?.trim()) {
    throw new Error("Month is required");
  }

  return {
    id: crypto.randomUUID(),
    amount,
    remainingAmount: amount,
    categoryId,
    userId,
    month,
    startDate,
    endDate,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Calculates remaining budget amount
 * Pure function: budget amount minus total expenses
 */
export function calculateRemainingBudget(
  budgetAmount: number,
  totalExpenses: number
): number {
  return Math.max(0, budgetAmount - totalExpenses);
}

/**
 * Validates budget data
 */
export function validateBudget(budget: Partial<Budget>): boolean {
  return !!(
    budget.amount &&
    budget.amount > 0 &&
    budget.categoryId?.trim() &&
    budget.userId?.trim() &&
    budget.month?.trim()
  );
}
