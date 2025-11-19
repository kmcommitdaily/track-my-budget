"use server";
import { createDependencies } from "@/infra/dependencies";
import { getCategoryWithBudget } from "@/core/use-cases";

/**
 * Server Action to fetch category with budget data.
 * This runs on the server and can be safely called from client components via React Query.
 * @param month Optional month filter in YYYY-MM format. If not provided, returns all budgets.
 */
export async function getCategoryWithBudgetAction(month?: string) {
  try {
    const deps = createDependencies();
    const budget = await getCategoryWithBudget(
      {
        budgetRepository: deps.budgetRepository,
        authService: deps.authService,
      },
      month
    );
    return budget;
  } catch (error) {
    console.error("Failed to fetch category with budget", error);
    throw error;
  }
}
