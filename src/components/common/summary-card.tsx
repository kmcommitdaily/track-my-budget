"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useSalaries } from "@/hooks/salary/queries/use-salaries";
import { useCategoryWithBudget } from "@/hooks/category/queries/use-category-with-budget";
import { useItemExpenses } from "@/hooks/expenses/queries/use-item-expenses";

interface SummaryCardProps {
  month?: string; // YYYY-MM format
}

export function SummaryCard({ month }: SummaryCardProps) {
  // Income and total budget show all months (not filtered)
  // Remaining budget is calculated using expenses from the selected month
  const { totalIncome, remainingIncome } = useSalaries();

  // Get all budgets for Total Budget calculation
  const { totalBudget } = useCategoryWithBudget();

  // Get budgets with month filter to calculate Remaining Budget correctly
  // (remaining budget uses expenses filtered by month)
  const { remainingBudget } = useCategoryWithBudget(month);

  const { totalExpenses } = useItemExpenses(month);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Income
              </p>
              <p className="text-2xl font-bold">₱{totalIncome}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Remaining Income
              </p>
              <p className="text-2xl font-bold">
                ₱{remainingIncome.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Budget
              </p>
              <p className="text-2xl font-bold">₱{totalBudget}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Remaining Budget
              </p>
              <p className="text-2xl font-bold">
                ₱{remainingBudget.toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </p>
            <p className="text-2xl font-bold">
              ₱{totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
