import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SalaryWithCompany } from "@/core/ports/salary-repository";

/**
 * Hook for deleting a salary/income entry.
 * Uses optimistic updates for instant UI feedback.
 *
 * @returns Mutation object with mutate function and loading/error states
 */
export function useDeleteSalary() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (salaryId: string) => {
      const response = await fetch("/api/finance", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salaryId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete salary");
      }

      return data;
    },
    onMutate: async (salaryId) => {
      // Cancel outgoing refetches for all possible query keys
      await queryClient.cancelQueries({ queryKey: ["salary"] });
      // Cancel month-specific queries
      await queryClient.cancelQueries({
        predicate: (query) => query.queryKey[0] === "salary",
      });

      // Snapshot previous values for all salary queries
      const allSalaryQueries = queryClient.getQueriesData({
        queryKey: ["salary"],
      });

      // Optimistically remove from all salary caches
      queryClient.setQueriesData(
        { queryKey: ["salary"] },
        (old: SalaryWithCompany[] | undefined) => {
          return (old || []).filter((salary) => salary.id !== salaryId);
        }
      );

      return { allSalaryQueries };
    },
    onError: (err, salaryId, context) => {
      // Rollback on error - restore all query states
      if (context?.allSalaryQueries) {
        context.allSalaryQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: () => {
      // Refetch to ensure consistency - invalidate all salary queries
      queryClient.invalidateQueries({ queryKey: ["salary"] });
    },
  });

  return {
    deleteSalary: mutation.mutate,
    deleteSalaryAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    deleteError: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
