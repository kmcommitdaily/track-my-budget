import { useQuery } from "@tanstack/react-query";
import { useCategoryWithBudget } from "../../category/queries/use-category-with-budget";

export type Salary = {
  id: string;
  company: string;
  amount: number;
};

/**
 * Hook for fetching salary/income data.
 * Provides computed values for total income and remaining income.
 *
 * @returns Query result with additional computed values (totalIncome, remainingIncome)
 */
export function useSalaries() {
  const { totalBudget } = useCategoryWithBudget();
  const query = useQuery<Salary[], Error>({
    queryKey: ["salary"],
    queryFn: async () => {
      const response = await fetch("/api/finance");

      if (!response.ok) throw new Error("Failed to fetch salary");
      const data = await response.json();
      return data.salaries as Salary[];
    },
  });

  const totalIncome =
    query.data?.reduce((total, salary) => total + Number(salary.amount), 0) ||
    0;

  const remainingIncome = totalIncome - totalBudget;

  return {
    ...query,
    totalIncome,
    remainingIncome,
  };
}
