/**
 * Delete Item Expense Use Case
 * Application logic for deleting an expense/item
 */

import type { ExpenseRepository } from "../ports/expense-repository";
import type { AuthService } from "../ports/auth-service";

export type DeleteItemExpenseDependencies = {
  expenseRepository: ExpenseRepository;
  authService: AuthService;
};

/**
 * Deletes an expense/item if it belongs to the authenticated user
 */
export async function deleteItemExpenseUseCase(
  deps: DeleteItemExpenseDependencies,
  itemExpenseId: string
): Promise<boolean> {
  const session = await deps.authService.getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!itemExpenseId?.trim()) {
    throw new Error("Item expense ID is required");
  }

  const expense = await deps.expenseRepository.findById(itemExpenseId);
  if (!expense) {
    throw new Error("Item expense not found");
  }

  if (expense.userId !== session.user.id) {
    throw new Error("Unauthorized: item expense does not belong to user");
  }

  return await deps.expenseRepository.delete(itemExpenseId, session.user.id);
}
