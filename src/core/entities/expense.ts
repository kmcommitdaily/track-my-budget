/**
 * Expense Entity
 * Pure business logic for expense/item domain model
 */

export type Expense = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: string;
  budgetId: string;
  userId: string;
  month: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Creates a new expense entity
 */
export function createExpense(
  name: string,
  price: number,
  categoryId: string,
  budgetId: string,
  userId: string,
  month: string,
  quantity: number = 1
): Expense {
  if (!name?.trim()) {
    throw new Error("Expense name is required");
  }
  if (price <= 0) {
    throw new Error("Expense price must be greater than 0");
  }
  if (!categoryId?.trim()) {
    throw new Error("Category ID is required");
  }
  if (!budgetId?.trim()) {
    throw new Error("Budget ID is required");
  }
  if (!userId?.trim()) {
    throw new Error("User ID is required");
  }
  if (!month?.trim()) {
    throw new Error("Month is required");
  }
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    price,
    quantity,
    categoryId,
    budgetId,
    userId,
    month,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Calculates total expense amount (price * quantity)
 */
export function calculateExpenseTotal(price: number, quantity: number): number {
  return price * quantity;
}

/**
 * Validates expense data
 */
export function validateExpense(expense: Partial<Expense>): boolean {
  return !!(
    expense.name?.trim() &&
    expense.price &&
    expense.price > 0 &&
    expense.categoryId?.trim() &&
    expense.budgetId?.trim() &&
    expense.userId?.trim() &&
    expense.month?.trim()
  );
}
