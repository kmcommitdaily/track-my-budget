import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateCategoryInput {
  categoryTitle: string;
  amount: number;
}

/**
 * Hook for creating a new category with budget.
 * Automatically invalidates the category-with-budget query on success.
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
    onSuccess: () => {
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
