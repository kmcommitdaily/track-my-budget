/**
 * Create Salary Use Case
 * Application logic for creating a new salary/income
 */

import { createSalary } from "../entities/salary";
import type { SalaryRepository } from "../ports/salary-repository";
import type { CompanyRepository } from "../ports/company-repository";
import type { AuthService } from "../ports/auth-service";
import { createCompany } from "../entities/company";

export type CreateSalaryDependencies = {
  salaryRepository: SalaryRepository;
  companyRepository: CompanyRepository;
  authService: AuthService;
};

export type CreateSalaryInput = {
  companyName: string;
  amount: number;
  month?: string;
};

/**
 * Creates a new salary, creating company if it doesn't exist
 */
export async function createSalaryUseCase(
  deps: CreateSalaryDependencies,
  input: CreateSalaryInput
): Promise<string> {
  const session = await deps.authService.getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (!input.companyName?.trim() || input.amount <= 0) {
    throw new Error("Invalid input: company name and valid amount required");
  }

  const month = input.month || getCurrentMonth();

  // Ensure company exists (create if needed)
  let company = await deps.companyRepository.findByName(input.companyName);
  if (!company) {
    const newCompany = createCompany(input.companyName);
    company = await deps.companyRepository.create(newCompany);
  }

  if (!company) {
    throw new Error("Failed to create or find company");
  }

  // Create salary
  const salary = createSalary(input.amount, company.id, session.user.id, month);
  const created = await deps.salaryRepository.create(salary);
  return created.id;
}

/**
 * Gets current month in YYYY-MM format
 */
function getCurrentMonth(): string {
  const date = new Date();
  return date.toISOString().slice(0, 7);
}
