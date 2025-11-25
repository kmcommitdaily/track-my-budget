import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BudgetWithCategory } from "@/core/ports/budget-repository";
import type { ItemExpenses } from "@/hooks/expenses/queries/use-item-expenses";

/**
 * Hook for deleting an item expense.
 * Uses optimistic updates for instant UI feedback.
 *
 * @returns Mutation object with mutate function and loading/error states
 */
export function useDeleteItemExpense() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (itemExpenseId: string) => {
      // If it's a temporary ID from optimistic update, skip server request
      // The item was never actually created on the server
      if (itemExpenseId.startsWith("temp-")) {
        return { success: true, skipped: true };
      }

      const response = await fetch("/api/expense", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemExpensesId: itemExpenseId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete item expense");
      }

      return data;
    },
    onMutate: async (itemExpenseId) => {
      // Cancel outgoing refetches for all matching queries
      await queryClient.cancelQueries({
        predicate: (query) =>
          query.queryKey[0] === "item-expenses" ||
          query.queryKey[0] === "category-with-budget",
      });

      // Snapshot previous values for all queries
      const allExpenseQueries = queryClient.getQueriesData({
        queryKey: ["item-expenses"],
      });
      const allBudgetQueries = queryClient.getQueriesData({
        queryKey: ["category-with-budget"],
      });

      // Find expense to get its price and categoryId
      // Search through all expense queries to find the expense
      let expenseToDelete: ItemExpenses | undefined;
      for (const [, data] of allExpenseQueries) {
        const expenses = (data as ItemExpenses[]) || [];
        expenseToDelete = expenses.find((e) => e.id === itemExpenseId);
        if (expenseToDelete) break;
      }

      // Optimistically remove from all expense caches
      queryClient.setQueriesData(
        { queryKey: ["item-expenses"] },
        (old: ItemExpenses[] | undefined) => {
          return (old || []).filter((expense) => expense.id !== itemExpenseId);
        }
      );

      // Optimistically update budget remaining amount in all budget caches
      if (expenseToDelete) {
        queryClient.setQueriesData(
          { queryKey: ["category-with-budget"] },
          (old: BudgetWithCategory[] | undefined) => {
            return (old || []).map((budget) => {
              if (budget.categoryId === expenseToDelete.categoryId) {
                const currentRemaining = Number(
                  budget.remainingAmount || budget.amount
                );
                return {
                  ...budget,
                  remainingAmount: (
                    currentRemaining + expenseToDelete.price
                  ).toString(),
                };
              }
              return budget;
            });
          }
        );
      }

      return {
        allExpenseQueries,
        allBudgetQueries,
        isTempId: itemExpenseId.startsWith("temp-"),
      };
    },
    onError: (err, itemExpenseId, context) => {
      // Rollback on error - restore all query states
      if (context?.allExpenseQueries) {
        context.allExpenseQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.allBudgetQueries) {
        context.allBudgetQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: (data, variables, context) => {
      // If it was a temp ID, we already removed it from cache, no need to refetch
      // Otherwise, refetch to ensure consistency
      if (!context?.isTempId) {
        queryClient.invalidateQueries({ queryKey: ["item-expenses"] });
        queryClient.invalidateQueries({ queryKey: ["category-with-budget"] });
      }
    },
  });

  return {
    deleteItemExpense: mutation.mutate,
    deleteItemExpenseAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    deleteError: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
