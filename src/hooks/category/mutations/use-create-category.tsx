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

      // Cancel outgoing refetches for all matching queries
      await queryClient.cancelQueries({
        predicate: (query) => query.queryKey[0] === "category-with-budget",
      });

      // Snapshot previous values for all budget queries
      const allBudgetQueries = queryClient.getQueriesData({
        queryKey: ["category-with-budget"],
      });

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

      // Optimistically add to all budget caches (updates all matching queries at once)
      queryClient.setQueriesData(
        { queryKey: ["category-with-budget"] },
        (old: BudgetWithCategory[] | undefined) => {
          return [...(old || []), optimisticBudget];
        }
      );

      return { allBudgetQueries, month: currentMonth };
    },
    onError: (err, newCategory, context) => {
      // Rollback on error - restore all query states
      if (context?.allBudgetQueries) {
        context.allBudgetQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
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
