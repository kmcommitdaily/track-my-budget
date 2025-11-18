import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook for deleting a category.
 * Automatically invalidates related queries (category-with-budget and item-expenses) on success.
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
    onSuccess: () => {
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
