import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SalaryWithCompany } from "@/core/ports/salary-repository";

export interface CreateSalaryInput {
  companyName: string;
  amount: number;
}

/**
 * Hook for creating a new salary/income entry.
 * Uses optimistic updates for instant UI feedback, then refetches to ensure consistency.
 *
 * @returns Mutation object with mutate function and loading/error states
 */
export function useCreateSalary() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newSalary: CreateSalaryInput) => {
      const response = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSalary),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add salary");
      }

      return response.json();
    },
    onMutate: async (newSalary) => {
      // Cancel outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["salary"] });

      // Snapshot previous value for rollback
      const previousSalaries = queryClient.getQueryData(["salary"]);

      // Optimistically update cache with temporary data
      queryClient.setQueryData(
        ["salary"],
        (old: SalaryWithCompany[] | undefined) => {
          const tempId = `temp-${Date.now()}`;
          const optimisticSalary: SalaryWithCompany = {
            id: tempId,
            company: newSalary.companyName,
            amount: newSalary.amount,
            companyId: tempId,
            userId: "",
            month: new Date().toISOString().slice(0, 7),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return [...(old || []), optimisticSalary];
        }
      );

      return { previousSalaries };
    },
    onError: (err, newSalary, context) => {
      // Rollback on error
      if (context?.previousSalaries) {
        queryClient.setQueryData(["salary"], context.previousSalaries);
      }
    },
    onSuccess: () => {
      // Refetch to get server data (with proper IDs, etc.)
      queryClient.invalidateQueries({ queryKey: ["salary"] });
    },
  });

  return {
    createSalary: mutation.mutate,
    createSalaryAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    createError: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
