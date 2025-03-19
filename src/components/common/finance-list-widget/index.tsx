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

export const FinanceListWidget: React.FC<FinanceListCardProps> = ({
  variant,
}) => {
  const { entries, addEntry, removeEntry } = useFinanceEntry();

  // ✅ Debugging
  console.log('🔍 Variant prop received:', variant);
  console.log('🔍 VARIANT[variant]:', VARIANT[variant]);
  console.log('🔍 Entries:', entries);
  console.log('🔍 Entries for this variant:', entries?.[VARIANT[variant]]);

  return (
    <Card className="p-4 w-full">
      <h1>{variant === 'SALARY' ? 'Income' : 'Categories'}</h1>

      {/* ✅ Fix: Check if entries exist before mapping */}
      {entries?.[VARIANT[variant]] && entries[VARIANT[variant]].length > 0 ? (
        entries[VARIANT[variant]].map((entryItem) => {
          return variant === 'SALARY' ? (
            <IncomeList
              key={entryItem.id}
              entry={entryItem}
              onDelete={removeEntry} // ✅ Only pass `removeEntry`, it already expects (id: string)
            />
          ) : (
            <CategoryList key={entryItem.id} entry={entryItem} />
          );
        })
      ) : (
        <p className="text-gray-500">No entries yet.</p> // ✅ Better UI feedback
      )}

      {/* ✅ Pass the `variant` correctly to handle different entries */}
      <FinanceEntryDialog
        variant={variant}
        onAdd={async (entry) => {
          console.log('➕ Adding entry:', entry);
          await addEntry(variant, entry);
        }}
      />
    </Card>
  );
};
