'use client';
import { FinanceEntryDialog } from '@/components/common/finance-entry-dialog';
import { Card } from '@/components/ui/card';
import { useFinanceEntry } from '@/hooks/use-finance-entry';

import { CategoryList } from './category-list';
import { IncomeList } from './income-list';

type IncomeListCardProps = {
  variant: 'Salary' | 'Category';
};

// refactor this, make a separate component for Salary and Category
export const FinanceListWidget: React.FC<IncomeListCardProps> = ({
  variant,
}) => {
  const { entries, addEntry } = useFinanceEntry();

  return (
    <Card className="p-4 w-full">
      <h1>{variant === 'Salary' ? 'Income' : 'Categories'}</h1>
      {entries &&
        entries[variant].map((entryItem) => {
          return variant === 'Salary' ? (
            <IncomeList key={entryItem.id} entry={entryItem} />
          ) : (
            <CategoryList key={entryItem.id} entry={entryItem} />
          );
        })}

      <FinanceEntryDialog
        variant={variant}
        onAdd={(entry) => addEntry(variant, entry)}
      />
    </Card>
  );
};
