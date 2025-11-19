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

      // Cancel outgoing refetches for both with and without month
      await queryClient.cancelQueries({ queryKey: ["salary"] });
      await queryClient.cancelQueries({ queryKey: ["salary", currentMonth] });

      // Snapshot previous values
      const previousSalaries = queryClient.getQueryData([
        "salary",
        currentMonth,
      ]);
      const previousSalariesAll = queryClient.getQueryData(["salary"]);

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

      // Optimistically update cache (with month)
      queryClient.setQueryData(
        ["salary", currentMonth],
        (old: SalaryWithCompany[] | undefined) => {
          return [...(old || []), optimisticSalary];
        }
      );

      // Also update the all-salaries query if it exists
      queryClient.setQueryData(
        ["salary"],
        (old: SalaryWithCompany[] | undefined) => {
          return [...(old || []), optimisticSalary];
        }
      );

      return { previousSalaries, previousSalariesAll, month: currentMonth };
    },
    onError: (err, newSalary, context) => {
      // Rollback on error
      const month = context?.month;
      if (context?.previousSalaries && month) {
        queryClient.setQueryData(["salary", month], context.previousSalaries);
      }
      if (context?.previousSalariesAll) {
        queryClient.setQueryData(["salary"], context.previousSalariesAll);
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
