import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

export type itemExpenses = {
  id: string;
  itemName: string;
  categoryId: string;
  price: number;
};

export function useItemExpenses() {
  const queryClient = useQueryClient();

  const query = useQuery<itemExpenses[] | Error>({
    queryKey: ['item-expenses'],
    queryFn: async () => {
      const response = await fetch('/api/expenses');

      if (!response.ok) throw new Error('fetch to fetch items expenses');

      const data = await response.json();

      return data.itemExpenses as itemExpenses[];
    },
  });

  const createItemExpenses = useMutation({
    mutationFn: async (newItemExpenses: {
      itemName: string;
      categoryId: string;
      price: number;
    }) => {
      const response = await fetch('api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItemExpenses),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'failed to add itemExpenses');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-expenses'] });
    },
  });

  const deleteItemExpenses = useMutation({
    mutationFn: async (itemExpensesId: string) => {
      const response = await fetch('/api/expense', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemExpensesId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete item expense');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-expenses'] });
    },
  });

  return {
    ...query,

    createItemExpenses: createItemExpenses.mutate,
    deleteItemExpenses: deleteItemExpenses.mutate,
    isCreating: createItemExpenses.isPending,
    createError: createItemExpenses.error,
    isDeleting: deleteItemExpenses.isPending,
    deleteError: deleteItemExpenses.error,
  };
}
