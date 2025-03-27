'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinance } from '@/hooks/finance-context';
import { useSalaries } from '@/hooks/use-salaries';
import { useCategoryWithBudget } from '@/hooks/use-category-with-budget';

export function SummaryCard() {
  const { getTotalExpenses, getRemainingBudget, getRemainingIncome } =
    useFinance();

  const { totalIncome } = useSalaries();
  const { totalBudget } = useCategoryWithBudget();
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
                ₱{getRemainingIncome().toLocaleString()}
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
                ₱{getRemainingBudget().toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </p>
            <p className="text-2xl font-bold">
              ₱{getTotalExpenses().toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
