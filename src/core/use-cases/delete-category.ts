/**
 * Delete Category Use Case
 * Application logic for deleting a category
 */

import type { CategoryRepository } from "../ports/category-repository";
import type { AuthService } from "../ports/auth-service";

export type DeleteCategoryDependencies = {
  categoryRepository: CategoryRepository;
  authService: AuthService;
};

/**
 * Deletes a category if it belongs to the authenticated user
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

  const category = await deps.categoryRepository.findById(categoryId);
  if (!category) {
    throw new Error("Category not found");
  }

  if (category.userId !== session.user.id) {
    throw new Error("Unauthorized: category does not belong to user");
  }

  return await deps.categoryRepository.delete(categoryId, session.user.id);
}
