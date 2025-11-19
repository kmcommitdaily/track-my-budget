import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SalaryWithCompany } from "@/core/ports/salary-repository";
import { getCurrentMonth } from "@/utils/month-utils";

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
      // Get current month using local timezone
      const currentMonth = getCurrentMonth();

      // Cancel outgoing refetches for all matching queries
      await queryClient.cancelQueries({
        predicate: (query) => query.queryKey[0] === "salary",
      });

      // Snapshot previous values for all salary queries
      const allSalaryQueries = queryClient.getQueriesData({
        queryKey: ["salary"],
      });

      const tempId = `temp-${Date.now()}`;
      const optimisticSalary: SalaryWithCompany = {
        id: tempId,
        company: newSalary.companyName,
        amount: newSalary.amount,
        companyId: tempId,
        userId: "",
        month: currentMonth,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Optimistically update all salary caches (updates all matching queries at once)
      queryClient.setQueriesData(
        { queryKey: ["salary"] },
        (old: SalaryWithCompany[] | undefined) => {
          return [...(old || []), optimisticSalary];
        }
      );

      return { allSalaryQueries, month: currentMonth };
    },
    onError: (err, newSalary, context) => {
      // Rollback on error - restore all query states
      if (context?.allSalaryQueries) {
        context.allSalaryQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: (data, variables, context) => {
      // Refetch to get server data (with proper IDs, etc.)
      const month = context?.month;
      queryClient.invalidateQueries({ queryKey: ["salary"] });
      if (month) {
        queryClient.invalidateQueries({ queryKey: ["salary", month] });
      }
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
