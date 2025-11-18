import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook for deleting an item expense.
 * Automatically invalidates related queries (item-expenses and category-with-budget) on success.
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
    onSuccess: () => {
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
