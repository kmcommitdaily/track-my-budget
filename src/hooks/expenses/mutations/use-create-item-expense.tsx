import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BudgetWithCategory } from "@/core/ports/budget-repository";
import type { ItemExpenses } from "@/hooks/expenses/queries/use-item-expenses";

export interface CreateItemExpenseInput {
  itemName: string;
  categoryId: string;
  price: number;
  month?: string; // YYYY-MM format for optimistic updates
}

export interface CreateItemExpenseOptions {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
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
      // Month is used in onMutate for optimistic updates, but not sent to API
      // API uses current month by default
      const { month, ...expenseData } = newItemExpense;
      void month; // Month is intentionally not sent to API, used in onMutate
      const response = await fetch("/api/expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add item expense");
      }

      return response.json();
    },
    onMutate: async (newItemExpense) => {
      // Get month from input
      const month = newItemExpense.month;

      // Cancel outgoing refetches for both with and without month
      await queryClient.cancelQueries({ queryKey: ["item-expenses"] });
      if (month) {
        await queryClient.cancelQueries({ queryKey: ["item-expenses", month] });
      }
      await queryClient.cancelQueries({ queryKey: ["category-with-budget"] });
      if (month) {
        await queryClient.cancelQueries({
          queryKey: ["category-with-budget", month],
        });
      }

      // Snapshot previous values for both query keys
      const previousExpenses = queryClient.getQueryData([
        "item-expenses",
        month,
      ]);
      const previousExpensesAll = queryClient.getQueryData(["item-expenses"]);
      const previousBudgets = queryClient.getQueryData([
        "category-with-budget",
        month,
      ]);
      const previousBudgetsAll = queryClient.getQueryData([
        "category-with-budget",
      ]);

      // Get category title from budgets cache (try month-specific first, then all)
      const budgets =
        ((previousBudgets || previousBudgetsAll) as BudgetWithCategory[]) || [];
      const category = budgets.find(
        (b) => b.categoryId === newItemExpense.categoryId
      );

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

      // Optimistically add to expenses cache (with month if provided)
      if (month) {
        queryClient.setQueryData(
          ["item-expenses", month],
          (old: ItemExpenses[] | undefined) => {
            return [...(old || []), optimisticExpense];
          }
        );
      }
      // Also update the all-expenses query if it exists
      queryClient.setQueryData(
        ["item-expenses"],
        (old: ItemExpenses[] | undefined) => {
          return [...(old || []), optimisticExpense];
        }
      );

      // Optimistically update budget remaining amount (with month if provided)
      const updateBudget = (old: BudgetWithCategory[] | undefined) => {
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
      };

      if (month) {
        queryClient.setQueryData(["category-with-budget", month], updateBudget);
      }
      queryClient.setQueryData(["category-with-budget"], updateBudget);

      return {
        previousExpenses,
        previousExpensesAll,
        previousBudgets,
        previousBudgetsAll,
        month,
      };
    },
    onError: (err, newItemExpense, context) => {
      // Rollback on error
      const month = context?.month;
      if (context?.previousExpenses && month) {
        queryClient.setQueryData(
          ["item-expenses", month],
          context.previousExpenses
        );
      }
      if (context?.previousExpensesAll) {
        queryClient.setQueryData(
          ["item-expenses"],
          context.previousExpensesAll
        );
      }
      if (context?.previousBudgets && month) {
        queryClient.setQueryData(
          ["category-with-budget", month],
          context.previousBudgets
        );
      }
      if (context?.previousBudgetsAll) {
        queryClient.setQueryData(
          ["category-with-budget"],
          context.previousBudgetsAll
        );
      }
    },
    onSuccess: (data, variables, context) => {
      // Refetch to get server data
      const month = context?.month;
      queryClient.invalidateQueries({ queryKey: ["item-expenses"] });
      if (month) {
        queryClient.invalidateQueries({ queryKey: ["item-expenses", month] });
      }
      queryClient.invalidateQueries({ queryKey: ["category-with-budget"] });
      if (month) {
        queryClient.invalidateQueries({
          queryKey: ["category-with-budget", month],
        });
      }
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
