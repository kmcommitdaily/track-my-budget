// hooks/useDeleteSalary.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (salaryId: string) => {
      const res = await fetch('/api/finance', {
        method: 'DELETE',
        body: JSON.stringify({ salaryId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete income');
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate or refetch income data
      queryClient.invalidateQueries({ queryKey: ['income'] });
    },
  });
}
