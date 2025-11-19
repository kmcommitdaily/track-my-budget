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
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["category-with-budget"] });
      await queryClient.cancelQueries({ queryKey: ["item-expenses"] });

      // Snapshot previous values
      const previousBudgets = queryClient.getQueryData([
        "category-with-budget",
      ]);
      const previousExpenses = queryClient.getQueryData(["item-expenses"]);

      // Optimistically remove from budgets cache
      queryClient.setQueryData(
        ["category-with-budget"],
        (old: BudgetWithCategory[] | undefined) => {
          return (old || []).filter(
            (budget) => budget.categoryId !== categoryId
          );
        }
      );

      // Optimistically remove related expenses
      queryClient.setQueryData(
        ["item-expenses"],
        (old: ItemExpenses[] | undefined) => {
          return (old || []).filter(
            (expense) => expense.categoryId !== categoryId
          );
        }
      );

      return { previousBudgets, previousExpenses };
    },
    onError: (err, categoryId, context) => {
      // Rollback on error
      if (context?.previousBudgets) {
        queryClient.setQueryData(
          ["category-with-budget"],
          context.previousBudgets
        );
      }
      if (context?.previousExpenses) {
        queryClient.setQueryData(["item-expenses"], context.previousExpenses);
      }
    },
    onSuccess: () => {
      // Refetch to ensure consistency
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
