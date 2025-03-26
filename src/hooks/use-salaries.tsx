import {useQuery, useQueryClient, useMutation} from "@tanstack/react-query"


export type Salary = {
    id: string;
    company: string;
    amount: number
}

export function useSalaries() {
   const  queryClient = useQueryClient()

const query = useQuery<Salary[], Error>({
    queryKey: ['salary'],
    queryFn: async () => {
        const response = await fetch('/api/finance')

        if(!response.ok)
            throw new Error("failed to fetch salary")
        const data = await response.json()
         return data.salaries as Salary[]
    }
})


const createSalary = useMutation({
    mutationFn: async (newSalary: {
        companyName: string,
        amount: number
    } ) => {
        const response = await fetch('/api/finance', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newSalary)
        })

        if(!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "failed to add salary")
        }

        return response.json()
    },
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['salary']})
    }
})


const deleteSalary = useMutation({
    mutationFn: async (salaryId: string) => {
      const response = await fetch('/api/finance', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salaryId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete salary');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary'] });
    },
  });

return {
    ...query,
    createSalary: createSalary.mutate,
    deleteSalary: deleteSalary.mutate,
    isCreating: createSalary.isPending,
    createError: createSalary.error,
    isDeleting: deleteSalary.isPending,
    deleteError: deleteSalary.error,
}

}


