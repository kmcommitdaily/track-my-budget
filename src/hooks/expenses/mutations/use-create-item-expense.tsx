import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateItemExpenseInput {
  itemName: string;
  categoryId: string;
  price: number;
}

/**
 * Hook for creating a new item expense.
 * Automatically invalidates the item-expenses and category-with-budget queries on success.
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
    onSuccess: () => {
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
