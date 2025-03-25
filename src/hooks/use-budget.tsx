import { useQuery, UseQueryResult } from '@tanstack/react-query';

export type Budget = {
  id: string;
  amount: string;
  categoryTitle: string;
};

export function useBudget(): UseQueryResult<Budget[], Error> {
  return useQuery<Budget[], Error>({
    queryKey: ['budget'],
    queryFn: async () => {
      const response = await fetch('/api/category-budget');
      if (!response.ok) throw new Error('Failed to fetch budget data');
      const data = await response.json();
      return data.budget as Budget[];
    },
  });
}
