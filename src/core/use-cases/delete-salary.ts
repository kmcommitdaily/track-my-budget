/**
 * Delete Salary Use Case
 * Application logic for deleting a salary/income
 *
 * Optimized: Removed findById call - delete operation now validates ownership
 * in a single database query, reducing latency from 2 round trips to 1.
 */

import type { SalaryRepository } from "../ports/salary-repository";
import type { AuthService } from "../ports/auth-service";

export type DeleteSalaryDependencies = {
  salaryRepository: SalaryRepository;
  authService: AuthService;
};

/**
 * Deletes a salary if it belongs to the authenticated user.
 *
 * Performance: Uses a single DELETE query with userId check instead of
 * findById + delete (2 queries), reducing latency by ~50%.
 */
export async function deleteSalaryUseCase(
  deps: DeleteSalaryDependencies,
  salaryId: string
): Promise<boolean> {
  const session = await deps.authService.getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!salaryId?.trim()) {
    throw new Error("Salary ID is required");
  }

  // Delete with userId check in WHERE clause - single query operation
  // Repository will return false if no rows were deleted (not found or unauthorized)
  const deleted = await deps.salaryRepository.delete(salaryId, session.user.id);

  if (!deleted) {
    throw new Error("Salary not found or unauthorized");
  }

  return deleted;
}
