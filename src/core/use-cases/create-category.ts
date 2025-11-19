/**
 * Create Category Use Case
 * Application logic for creating a new category
 */

import { createCategory } from "../entities/category";
import type { CategoryRepository } from "../ports/category-repository";
import type { AuthService } from "../ports/auth-service";

export type CreateCategoryDependencies = {
  categoryRepository: CategoryRepository;
  authService: AuthService;
};

export type CreateCategoryInput = {
  categoryTitle: string;
  month?: string;
};

/**
 * Creates a new category or returns existing one
 */
export async function createCategoryUseCase(
  deps: CreateCategoryDependencies,
  input: CreateCategoryInput
): Promise<string> {
  const session = await deps.authService.getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const month = input.month || getCurrentMonth();

  // Check if category already exists
  const existing = await deps.categoryRepository.findByTitle(
    input.categoryTitle,
    session.user.id
  );

  if (existing) {
    return existing.id;
  }

  // Create new category
  const category = createCategory(input.categoryTitle, session.user.id, month);
  const created = await deps.categoryRepository.create(category);
  return created.id;
}

/**
 * Gets current month in YYYY-MM format
 */
function getCurrentMonth(): string {
  const date = new Date();
  return date.toISOString().slice(0, 7);
}
