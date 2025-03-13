'use client';
import { FinanceEntryDialog } from '@/components/common/finance-entry-dialog';
import { Card } from '@/components/ui/card';
import { useFinanceEntry } from '@/hooks/use-finance-entry';

import { VARIANT, VariantTypeKey } from '@/components/types';
import { CategoryList } from './category-list';
import { IncomeList } from './income-list';
type FinanceListCardProps = {
  variant: VariantTypeKey;
};

// refactor this, make a separate component for Salary and Category
export const FinanceListWidget: React.FC<FinanceListCardProps> = ({
  variant,
}) => {
  const { entries, addEntry, removeEntry } = useFinanceEntry();
  console.log('Variant prop received:', variant);
  console.log('VARIANT[variant]:', VARIANT[variant]);
  console.log('Entries for this variant:', entries[VARIANT[variant]]);

  return (
    <Card className="p-4 w-full">
      <h1>{variant === 'SALARY' ? 'Income' : 'Categories'}</h1>
      {entries &&
        entries[VARIANT[variant]].map((entryItem) => {
          return variant === 'SALARY' ? (
            <IncomeList
              key={entryItem.id}
              entry={entryItem}
              onDelete={(deletedId) => removeEntry(deletedId)}
            />
          ) : (
            <CategoryList key={entryItem.id} entry={entryItem} />
          );
        })}

      <FinanceEntryDialog
        variant={variant}
        onAdd={async (entry) => {
          await addEntry(variant, entry); // ✅ Ensure the new entry is saved to the database
        }}
      />
    </Card>
  );
};
