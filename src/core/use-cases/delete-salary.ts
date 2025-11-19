/**
 * Delete Salary Use Case
 * Application logic for deleting a salary/income
 */

import type { SalaryRepository } from "../ports/salary-repository";
import type { AuthService } from "../ports/auth-service";

export type DeleteSalaryDependencies = {
  salaryRepository: SalaryRepository;
  authService: AuthService;
};

/**
 * Deletes a salary if it belongs to the authenticated user
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

  const salary = await deps.salaryRepository.findById(salaryId);
  if (!salary) {
    throw new Error("Salary not found");
  }

  if (salary.userId !== session.user.id) {
    throw new Error("Unauthorized: salary does not belong to user");
  }

  return await deps.salaryRepository.delete(salaryId, session.user.id);
}
