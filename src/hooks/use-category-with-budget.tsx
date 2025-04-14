import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

export type Budget = {
  id: string;
  amount: string;
  remainingAmount: string;
  categoryTitle: string;
  categoryId: string;
};

export function useCategoryWithBudget() {
  const queryClient = useQueryClient();

  const query = useQuery<Budget[], Error>({
    queryKey: ['category-with-budget'],
    queryFn: async () => {
      const response = await fetch('/api/category-budget');
      if (!response.ok) throw new Error('Failed to fetch category with budget');

      const data = await response.json();

      return data.budget as Budget[];
    },
  });

  const totalBudget =
    query.data?.reduce((total, budget) => total + Number(budget.amount), 0) ||
    0;

  const remainingBudget =
    query.data?.reduce(
      (total, budget) => total + Number(budget.remainingAmount),
      0
    ) || 0;

  const createCategory = useMutation({
    mutationFn: async (newCategory: {
      categoryTitle: string;
      amount: number;
    }) => {
      const response = await fetch('api/category-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'failed to add categorty');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-with-budget'] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await fetch('/api/category-budget', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete category');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category-with-budget'] });
      queryClient.invalidateQueries({ queryKey: ['item-expenses'] });
    },
  });

  return {
    ...query,
    totalBudget,
    remainingBudget,
    createCategory: createCategory.mutate,
    deleteCategory: deleteCategory.mutate,
    isCreating: createCategory.isPending,
    createError: createCategory.error,
    isDeleting: deleteCategory.isPending,
    deleteError: deleteCategory.error,
  };
}
