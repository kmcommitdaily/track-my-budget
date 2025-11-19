/**
 * Delete Item Expense Use Case
 * Application logic for deleting an expense/item
 *
 * Optimized: Removed findById call - delete operation now validates ownership
 * in a single database query, reducing latency from 2 round trips to 1.
 */

import type { ExpenseRepository } from "../ports/expense-repository";
import type { AuthService } from "../ports/auth-service";

export type DeleteItemExpenseDependencies = {
  expenseRepository: ExpenseRepository;
  authService: AuthService;
};

/**
 * Deletes an expense/item if it belongs to the authenticated user.
 *
 * Performance: Uses a single DELETE query with userId check instead of
 * findById + delete (2 queries), reducing latency by ~50%.
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

  // Delete with userId check in WHERE clause - single query operation
  // Repository will return false if no rows were deleted (not found or unauthorized)
  const deleted = await deps.expenseRepository.delete(
    itemExpenseId,
    session.user.id
  );

  if (!deleted) {
    throw new Error("Item expense not found or unauthorized");
  }

  return deleted;
}
