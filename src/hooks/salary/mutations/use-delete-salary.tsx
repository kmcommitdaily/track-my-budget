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
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["salary"] });

      // Snapshot previous value
      const previousSalaries = queryClient.getQueryData(["salary"]);

      // Optimistically remove from cache
      queryClient.setQueryData(
        ["salary"],
        (old: SalaryWithCompany[] | undefined) => {
          return (old || []).filter((salary) => salary.id !== salaryId);
        }
      );

      return { previousSalaries };
    },
    onError: (err, salaryId, context) => {
      // Rollback on error
      if (context?.previousSalaries) {
        queryClient.setQueryData(["salary"], context.previousSalaries);
      }
    },
    onSuccess: () => {
      // Refetch to ensure consistency
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
