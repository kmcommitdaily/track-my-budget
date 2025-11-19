/**
 * Delete Category Use Case
 * Application logic for deleting a category
 *
 * Optimized: Removed findById call - delete operation now validates ownership
 * in a single database query, reducing latency from 2 round trips to 1.
 */

import type { CategoryRepository } from "../ports/category-repository";
import type { AuthService } from "../ports/auth-service";

export type DeleteCategoryDependencies = {
  categoryRepository: CategoryRepository;
  authService: AuthService;
};

/**
 * Deletes a category if it belongs to the authenticated user.
 *
 * Performance: Uses a single DELETE query with userId check instead of
 * findById + delete (2 queries), reducing latency by ~50%.
 */
export async function deleteCategoryUseCase(
  deps: DeleteCategoryDependencies,
  categoryId: string
): Promise<boolean> {
  const session = await deps.authService.getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!categoryId?.trim()) {
    throw new Error("Category ID is required");
  }

  // Delete with userId check in WHERE clause - single query operation
  // Repository will return false if no rows were deleted (not found or unauthorized)
  const deleted = await deps.categoryRepository.delete(
    categoryId,
    session.user.id
  );

  if (!deleted) {
    throw new Error("Category not found or unauthorized");
  }

  return deleted;
}
