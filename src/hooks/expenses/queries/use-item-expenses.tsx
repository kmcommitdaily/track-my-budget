import { useQuery } from "@tanstack/react-query";

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
 * @returns Query result with additional computed value (totalExpenses)
 */
export function useItemExpenses() {
  const query = useQuery<ItemExpenses[]>({
    queryKey: ["item-expenses"],
    queryFn: async () => {
      const response = await fetch("/api/expense");

      if (!response.ok) throw new Error("Failed to fetch items expenses");

      const data = await response.json();

      return data.itemExpenses as ItemExpenses[];
    },
  });

  const totalExpenses =
    query.data?.reduce((total, item) => total + Number(item.price), 0) || 0;

  return {
    ...query,
    totalExpenses,
  };
}
