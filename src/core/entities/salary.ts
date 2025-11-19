/**
 * Salary Entity
 * Pure business logic for salary/income domain model
 */

export type Salary = {
  id: string;
  amount: number;
  companyId: string;
  userId: string;
  month: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Creates a new salary entity
 */
export function createSalary(
  amount: number,
  companyId: string,
  userId: string,
  month: string
): Salary {
  if (amount <= 0) {
    throw new Error("Salary amount must be greater than 0");
  }
  if (!companyId?.trim()) {
    throw new Error("Company ID is required");
  }
  if (!userId?.trim()) {
    throw new Error("User ID is required");
  }
  if (!month?.trim()) {
    throw new Error("Month is required");
  }

  return {
    id: crypto.randomUUID(),
    amount,
    companyId,
    userId,
    month,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Calculates total income from salaries
 */
export function calculateTotalIncome(salaries: Salary[]): number {
  return salaries.reduce((total, salary) => total + salary.amount, 0);
}

/**
 * Validates salary data
 */
export function validateSalary(salary: Partial<Salary>): boolean {
  return !!(
    salary.amount &&
    salary.amount > 0 &&
    salary.companyId?.trim() &&
    salary.userId?.trim() &&
    salary.month?.trim()
  );
}
