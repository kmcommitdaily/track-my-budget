/**
 * Create Item Expense Use Case
 * Application logic for creating a new expense/item
 */

import { createExpense } from "../entities/expense";
import type { ExpenseRepository } from "../ports/expense-repository";
import type { BudgetRepository } from "../ports/budget-repository";
import type { AuthService } from "../ports/auth-service";

export type CreateItemExpenseDependencies = {
  expenseRepository: ExpenseRepository;
  budgetRepository: BudgetRepository;
  authService: AuthService;
};

export type CreateItemExpenseInput = {
  itemName: string;
  categoryId: string;
  price: number;
  month?: string;
};

/**
 * Creates a new expense/item
 */
export async function createItemExpenseUseCase(
  deps: CreateItemExpenseDependencies,
  input: CreateItemExpenseInput
): Promise<string> {
  const session = await deps.authService.getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (
    !input.itemName?.trim() ||
    !input.categoryId?.trim() ||
    input.price <= 0
  ) {
    throw new Error("All fields must be valid");
  }

  const month = input.month || getCurrentMonth();

  // Find budget for this category
  const budget = await deps.budgetRepository.findByCategoryId(input.categoryId);

  if (!budget) {
    throw new Error("No budget found in this category");
  }

  // Create expense
  const expense = createExpense(
    input.itemName,
    input.price,
    input.categoryId,
    budget.id,
    session.user.id,
    month
  );

  const created = await deps.expenseRepository.create(expense);
  return created.id;
}

/**
 * Gets current month in YYYY-MM format (using local timezone)
 */
function getCurrentMonth(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}
