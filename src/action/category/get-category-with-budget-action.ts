"use server";
import { createDependencies } from "@/infra/dependencies";
import { getCategoryWithBudget } from "@/core/use-cases";

/**
 * Server Action to fetch category with budget data.
 * This runs on the server and can be safely called from client components via React Query.
 */
export async function getCategoryWithBudgetAction() {
  try {
    const deps = createDependencies();
    const budget = await getCategoryWithBudget({
      budgetRepository: deps.budgetRepository,
      authService: deps.authService,
    });
    return budget;
  } catch (error) {
    console.error("Failed to fetch category with budget", error);
    throw error;
  }
}
