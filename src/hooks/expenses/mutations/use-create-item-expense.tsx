import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BudgetWithCategory } from "@/core/ports/budget-repository";
import type { ItemExpenses } from "@/hooks/expenses/queries/use-item-expenses";

export interface CreateItemExpenseInput {
  itemName: string;
  categoryId: string;
  price: number;
}

/**
 * Hook for creating a new item expense.
 * Uses optimistic updates for instant UI feedback.
 *
 * @returns Mutation object with mutate function and loading/error states
 */
export function useCreateItemExpense() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newItemExpense: CreateItemExpenseInput) => {
      const response = await fetch("/api/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItemExpense),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add item expense");
      }

      return response.json();
    },
    onMutate: async (newItemExpense) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["item-expenses"] });
      await queryClient.cancelQueries({ queryKey: ["category-with-budget"] });

      // Snapshot previous values
      const previousExpenses = queryClient.getQueryData(["item-expenses"]);
      const previousBudgets = queryClient.getQueryData([
        "category-with-budget",
      ]);

      // Get category title from budgets cache
      const budgets = (previousBudgets as BudgetWithCategory[]) || [];
      const category = budgets.find(
        (b) => b.categoryId === newItemExpense.categoryId
      );

      // Optimistically add to expenses cache
      queryClient.setQueryData(
        ["item-expenses"],
        (old: ItemExpenses[] | undefined) => {
          const tempId = `temp-${Date.now()}`;
          const optimisticExpense: ItemExpenses = {
            id: tempId,
            itemName: newItemExpense.itemName,
            price: newItemExpense.price,
            categoryId: newItemExpense.categoryId,
            budgetId: tempId,
            categoryTitle: category?.categoryTitle || "",
            budgetAmount: "0",
            remainingBudget: "0",
            createdAt: new Date().toISOString(),
          };
          return [...(old || []), optimisticExpense];
        }
      );

      // Optimistically update budget remaining amount
      queryClient.setQueryData(
        ["category-with-budget"],
        (old: BudgetWithCategory[] | undefined) => {
          return (old || []).map((budget) => {
            if (budget.categoryId === newItemExpense.categoryId) {
              const currentRemaining = Number(
                budget.remainingAmount || budget.amount
              );
              return {
                ...budget,
                remainingAmount: Math.max(
                  0,
                  currentRemaining - newItemExpense.price
                ).toString(),
              };
            }
            return budget;
          });
        }
      );

      return { previousExpenses, previousBudgets };
    },
    onError: (err, newItemExpense, context) => {
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
      // Refetch to get server data
      queryClient.invalidateQueries({ queryKey: ["item-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["category-with-budget"] });
    },
  });

  return {
    createItemExpense: mutation.mutate,
    createItemExpenseAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    createError: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
