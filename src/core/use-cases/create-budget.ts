/**
 * Create Budget Use Case
 * Application logic for creating a new budget
 */

import { createBudget } from "../entities/budget";
import type { BudgetRepository } from "../ports/budget-repository";
import type { CategoryRepository } from "../ports/category-repository";
import type { AuthService } from "../ports/auth-service";
import { createCategoryUseCase } from "./create-category";
import type { CreateCategoryDependencies } from "./create-category";

export type CreateBudgetDependencies = {
  budgetRepository: BudgetRepository;
  categoryRepository: CategoryRepository;
  authService: AuthService;
};

export type CreateBudgetInput = {
  amount: number;
  categoryTitle: string;
  month?: string;
};

/**
 * Creates a new budget, creating category if it doesn't exist
 */
export async function createBudgetUseCase(
  deps: CreateBudgetDependencies,
  input: CreateBudgetInput
): Promise<string> {
  const session = await deps.authService.getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!input.categoryTitle?.trim() || input.amount <= 0) {
    throw new Error("Invalid input: category title and valid amount required");
  }

  const month = input.month || getCurrentMonth();

  // Ensure category exists (create if needed)
  const categoryDeps: CreateCategoryDependencies = {
    categoryRepository: deps.categoryRepository,
    authService: deps.authService,
  };
  const categoryId = await createCategoryUseCase(categoryDeps, {
    categoryTitle: input.categoryTitle,
    month,
  });

  if (!categoryId) {
    throw new Error("Failed to create or find category");
  }

  // Create budget
  const budget = createBudget(input.amount, categoryId, session.user.id, month);
  const created = await deps.budgetRepository.create(budget);
  return created.id;
}

/**
 * Gets current month in YYYY-MM format
 */
function getCurrentMonth(): string {
  const date = new Date();
  return date.toISOString().slice(0, 7);
}
