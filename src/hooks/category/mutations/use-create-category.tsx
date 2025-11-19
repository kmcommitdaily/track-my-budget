import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BudgetWithCategory } from "@/core/ports/budget-repository";

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
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["category-with-budget"] });

      // Snapshot previous value
      const previousBudgets = queryClient.getQueryData([
        "category-with-budget",
      ]);

      // Optimistically add to cache
      queryClient.setQueryData(
        ["category-with-budget"],
        (old: BudgetWithCategory[] | undefined) => {
          const tempId = `temp-${Date.now()}`;
          const optimisticBudget: BudgetWithCategory = {
            id: tempId,
            categoryId: tempId,
            categoryTitle: newCategory.categoryTitle,
            amount: newCategory.amount.toString(),
            remainingAmount: newCategory.amount.toString(),
            userId: "",
            month: new Date().toISOString().slice(0, 7),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return [...(old || []), optimisticBudget];
        }
      );

      return { previousBudgets };
    },
    onError: (err, newCategory, context) => {
      // Rollback on error
      if (context?.previousBudgets) {
        queryClient.setQueryData(
          ["category-with-budget"],
          context.previousBudgets
        );
      }
    },
    onSuccess: () => {
      // Refetch to get server data
      queryClient.invalidateQueries({ queryKey: ["category-with-budget"] });
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
