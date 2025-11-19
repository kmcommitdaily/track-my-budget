/**
 * Get Salaries Use Case
 * Application logic for fetching salaries/income
 */

import type { SalaryRepository } from "../ports/salary-repository";
import type { AuthService } from "../ports/auth-service";

export type GetSalariesDependencies = {
  salaryRepository: SalaryRepository;
  authService: AuthService;
};

/**
 * Gets all salaries for the authenticated user
 */
export async function getSalariesUseCase(
  deps: GetSalariesDependencies,
  month?: string
) {
  const session = await deps.authService.getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  return await deps.salaryRepository.findByUserId(session.user.id, month);
}
