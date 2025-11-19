import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BudgetWithCategory } from "@/core/ports/budget-repository";
import { getCurrentMonth } from "@/utils/month-utils";

export interface CreateCategoryInput {
  categoryTitle: string;
  amount: number;
}

/**
 * Hook for creating a new category with budget.
 * Uses optimistic updates for instant UI feedback.
 *
 * @returns Mutation object with mutate function and loading/error states
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newCategory: CreateCategoryInput) => {
      const response = await fetch("/api/category-budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add category");
      }

      return response.json();
    },
    onMutate: async (newCategory) => {
      // Get current month using local timezone
      const currentMonth = getCurrentMonth();

      // Cancel outgoing refetches for both with and without month
      await queryClient.cancelQueries({ queryKey: ["category-with-budget"] });
      await queryClient.cancelQueries({
        queryKey: ["category-with-budget", currentMonth],
      });

      // Snapshot previous values
      const previousBudgets = queryClient.getQueryData([
        "category-with-budget",
        currentMonth,
      ]);
      const previousBudgetsAll = queryClient.getQueryData([
        "category-with-budget",
      ]);

      const tempId = `temp-${Date.now()}`;
      const optimisticBudget: BudgetWithCategory = {
        id: tempId,
        categoryId: tempId,
        categoryTitle: newCategory.categoryTitle,
        amount: newCategory.amount.toString(),
        remainingAmount: newCategory.amount.toString(),
        userId: "",
        month: currentMonth,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Optimistically add to cache (with month)
      queryClient.setQueryData(
        ["category-with-budget", currentMonth],
        (old: BudgetWithCategory[] | undefined) => {
          return [...(old || []), optimisticBudget];
        }
      );

      // Also update the all-budgets query if it exists
      queryClient.setQueryData(
        ["category-with-budget"],
        (old: BudgetWithCategory[] | undefined) => {
          return [...(old || []), optimisticBudget];
        }
      );

      return { previousBudgets, previousBudgetsAll, month: currentMonth };
    },
    onError: (err, newCategory, context) => {
      // Rollback on error
      const month = context?.month;
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
      queryClient.invalidateQueries({ queryKey: ["category-with-budget"] });
      if (month) {
        queryClient.invalidateQueries({
          queryKey: ["category-with-budget", month],
        });
      }
    },
  });

  return {
    createCategory: mutation.mutate,
    createCategoryAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    createError: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
