import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateSalaryInput {
  companyName: string;
  amount: number;
}

/**
 * Hook for creating a new salary/income entry.
 * Automatically invalidates the salary query on success.
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
    onSuccess: () => {
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
