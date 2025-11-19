"use server";
import { createDependencies } from "@/infra/dependencies";
import { getItemExpensesUseCase } from "@/core/use-cases";

/**
 * Server Action to fetch item expenses data.
 * This runs on the server and can be safely called from client components via React Query.
 */
export async function getItemExpensesAction() {
  try {
    const deps = createDependencies();
    const itemExpenses = await getItemExpensesUseCase({
      expenseRepository: deps.expenseRepository,
      authService: deps.authService,
    });
    return itemExpenses;
  } catch (error) {
    console.error("Failed to fetch item expenses", error);
    throw error;
  }
}
