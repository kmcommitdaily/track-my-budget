/**
 * Get Item Expenses Use Case
 * Application logic for fetching expenses/items
 */

import type { ExpenseRepository } from "../ports/expense-repository";
import type { AuthService } from "../ports/auth-service";

export type GetItemExpensesDependencies = {
  expenseRepository: ExpenseRepository;
  authService: AuthService;
};

/**
 * Gets all expenses for the authenticated user
 */
export async function getItemExpensesUseCase(
  deps: GetItemExpensesDependencies
) {
  const session = await deps.authService.getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  return await deps.expenseRepository.findByUserId(session.user.id);
}
