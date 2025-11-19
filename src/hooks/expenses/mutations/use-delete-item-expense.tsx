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
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["item-expenses"] });
      await queryClient.cancelQueries({ queryKey: ["category-with-budget"] });

      // Snapshot previous values
      const previousExpenses = queryClient.getQueryData(["item-expenses"]);
      const previousBudgets = queryClient.getQueryData([
        "category-with-budget",
      ]);

      // Find expense to get its price and categoryId
      const expenses = (previousExpenses as ItemExpenses[]) || [];
      const expenseToDelete = expenses.find((e) => e.id === itemExpenseId);

      // Optimistically remove from expenses cache
      queryClient.setQueryData(
        ["item-expenses"],
        (old: ItemExpenses[] | undefined) => {
          return (old || []).filter((expense) => expense.id !== itemExpenseId);
        }
      );

      // Optimistically update budget remaining amount
      if (expenseToDelete) {
        queryClient.setQueryData(
          ["category-with-budget"],
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

      return { previousExpenses, previousBudgets };
    },
    onError: (err, itemExpenseId, context) => {
      // Rollback on error
      if (context?.previousExpenses) {
        queryClient.setQueryData(["item-expenses"], context.previousExpenses);
      }
      if (context?.previousBudgets) {
        queryClient.setQueryData(
          ["category-with-budget"],
          context.previousBudgets
        );
      }
    },
    onSuccess: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["item-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["category-with-budget"] });
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
