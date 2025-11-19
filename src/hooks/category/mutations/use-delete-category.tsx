import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BudgetWithCategory } from "@/core/ports/budget-repository";
import type { ItemExpenses } from "@/hooks/expenses/queries/use-item-expenses";

/**
 * Hook for deleting a category.
 * Uses optimistic updates for instant UI feedback.
 *
 * @returns Mutation object with mutate function and loading/error states
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await fetch("/api/category-budget", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      return data;
    },
    onMutate: async (categoryId) => {
      // Cancel outgoing refetches for all possible query keys
      await queryClient.cancelQueries({ queryKey: ["category-with-budget"] });
      await queryClient.cancelQueries({ queryKey: ["item-expenses"] });
      // Cancel month-specific queries (we'll update all matching queries)
      await queryClient.cancelQueries({
        predicate: (query) =>
          query.queryKey[0] === "category-with-budget" ||
          query.queryKey[0] === "item-expenses",
      });

      // Snapshot previous values (we'll need to restore all)
      const allBudgetQueries = queryClient.getQueriesData({
        queryKey: ["category-with-budget"],
      });
      const allExpenseQueries = queryClient.getQueriesData({
        queryKey: ["item-expenses"],
      });

      // Optimistically remove from all budget caches
      queryClient.setQueriesData(
        { queryKey: ["category-with-budget"] },
        (old: BudgetWithCategory[] | undefined) => {
          return (old || []).filter(
            (budget) => budget.categoryId !== categoryId
          );
        }
      );

      // Optimistically remove related expenses from all expense caches
      queryClient.setQueriesData(
        { queryKey: ["item-expenses"] },
        (old: ItemExpenses[] | undefined) => {
          return (old || []).filter(
            (expense) => expense.categoryId !== categoryId
          );
        }
      );

      return { allBudgetQueries, allExpenseQueries };
    },
    onError: (err, categoryId, context) => {
      // Rollback on error - restore all query states
      if (context?.allBudgetQueries) {
        context.allBudgetQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.allExpenseQueries) {
        context.allExpenseQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: () => {
      // Refetch to ensure consistency - invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["category-with-budget"] });
      queryClient.invalidateQueries({ queryKey: ["item-expenses"] });
    },
  });

  return {
    deleteCategory: mutation.mutate,
    deleteCategoryAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    deleteError: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
