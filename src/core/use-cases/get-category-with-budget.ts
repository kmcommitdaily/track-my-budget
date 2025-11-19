/**
 * Get Category With Budget Use Case
 * Application logic for fetching categories with their budgets
 */

import type { BudgetRepository } from "../ports/budget-repository";
import type { AuthService } from "../ports/auth-service";

export type GetCategoryWithBudgetDependencies = {
  budgetRepository: BudgetRepository;
  authService: AuthService;
};

export type CategoryWithBudgetResult = {
  id: string;
  amount: string;
  categoryTitle: string;
  categoryId: string;
  remainingAmount: string;
  month: string;
};

/**
 * Gets all categories with their budgets for the authenticated user
 * @param month Optional month filter in YYYY-MM format. If not provided, returns all budgets.
 */
export async function getCategoryWithBudget(
  deps: GetCategoryWithBudgetDependencies,
  month?: string
): Promise<CategoryWithBudgetResult[]> {
  const session = await deps.authService.getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const budgets = await deps.budgetRepository.findByUserId(
    session.user.id,
    month
  );
  return budgets;
}
