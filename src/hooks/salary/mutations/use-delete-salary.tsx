import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook for deleting a salary/income entry.
 * Automatically invalidates the salary query on success.
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
    onSuccess: () => {
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
