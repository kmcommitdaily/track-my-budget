"use server";
import { getSessionAction } from "@/action/auth/get-user-session-action";
import { getBudget } from "@/db/repositories/budget";

/**
 * Server Action to fetch category with budget data.
 * This runs on the server and can be safely called from client components via React Query.
 */
export async function getCategoryWithBudgetAction() {
  try {
    const session = await getSessionAction();
    const budget = await getBudget(session.user.id);
    return budget;
  } catch (error) {
    console.error("Failed to fetch category with budget", error);
    throw error;
  }
}
