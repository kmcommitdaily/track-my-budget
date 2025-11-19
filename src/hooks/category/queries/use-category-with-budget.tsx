import { useQuery } from "@tanstack/react-query";

import { getCategoryWithBudgetAction } from "@/action/category/get-category-with-budget-action";

/**
 * Hook for fetching category with budget data.
 * Provides computed values for total and remaining budget.
 *
 * @param month Optional month filter in YYYY-MM format. If not provided, returns all budgets.
 * @returns Query result with additional computed values (totalBudget, remainingBudget)
 */
export function useCategoryWithBudget(month?: string) {
  const query = useQuery({
    queryKey: ["category-with-budget", month],
    queryFn: () => getCategoryWithBudgetAction(month),
  });

  const totalBudget =
    query.data?.reduce((total, budget) => total + Number(budget.amount), 0) ||
    0;

  const remainingBudget =
    query.data?.reduce(
      (total, budget) => total + Number(budget.remainingAmount),
      0
    ) || 0;

  return {
    ...query,
    totalBudget,
    remainingBudget,
  };
}
