/**
 * Dependency Factory
 * Assembles all dependencies for use cases using functional DI
 */

import { createAuthService } from "./services/auth-service";
import {
  createCategoryRepository,
  createBudgetRepository,
  createExpenseRepository,
  createSalaryRepository,
  createCompanyRepository,
} from "./db/repositories";

/**
 * Creates all dependencies for use cases
 */
export function createDependencies() {
  const authService = createAuthService();
  const categoryRepository = createCategoryRepository();
  const budgetRepository = createBudgetRepository();
  const expenseRepository = createExpenseRepository();
  const salaryRepository = createSalaryRepository();
  const companyRepository = createCompanyRepository();

  return {
    authService,
    categoryRepository,
    budgetRepository,
    expenseRepository,
    salaryRepository,
    companyRepository,
  };
}
