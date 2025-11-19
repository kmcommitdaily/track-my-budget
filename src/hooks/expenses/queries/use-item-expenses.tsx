import { useQuery } from "@tanstack/react-query";
import { getItemExpensesAction } from "@/action/expenses/get-item-expenses-action";

export type ItemExpenses = {
  id: string;
  itemName: string;
  price: number;
  categoryId: string;
  budgetId: string;
  createdAt: string;
  budgetAmount: string;
  remainingBudget: string;
  categoryTitle: string;
};

/**
 * Hook for fetching item expenses data.
 * Provides computed value for total expenses.
 *
 * @param month Optional month filter in YYYY-MM format. If not provided, returns all expenses.
 * @returns Query result with additional computed value (totalExpenses)
 */
export function useItemExpenses(month?: string) {
  const query = useQuery<ItemExpenses[]>({
    queryKey: ["item-expenses", month],
    queryFn: () => getItemExpensesAction(month),
  });

  const totalExpenses =
    query.data?.reduce((total, item) => total + Number(item.price), 0) || 0;

  return {
    ...query,
    totalExpenses,
  };
}
