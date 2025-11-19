/**
 * Clear Expenses By Month Use Case
 * Application logic for clearing all expenses for a specific month
 *
 * Note: This preserves categories and budgets as they have their own month fields.
 * Only expenses (items) are deleted for the specified month.
 */

import type { ExpenseRepository } from "../ports/expense-repository";
import type { AuthService } from "../ports/auth-service";

export type ClearExpensesByMonthDependencies = {
  expenseRepository: ExpenseRepository;
  authService: AuthService;
};

/**
 * Clears all expenses for a specific month for the authenticated user.
 * Categories and budgets are preserved.
 *
 * @param month Month in YYYY-MM format
 * @returns Number of expenses deleted
 */
export async function clearExpensesByMonthUseCase(
  deps: ClearExpensesByMonthDependencies,
  month: string
): Promise<number> {
  const session = await deps.authService.getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!month?.trim() || !/^\d{4}-\d{2}$/.test(month)) {
    throw new Error("Valid month in YYYY-MM format is required");
  }

  const deletedCount = await deps.expenseRepository.deleteByMonth(
    session.user.id,
    month
  );

  return deletedCount;
}
