'use client';
import { FinanceEntryDialog } from '@/components/common/FinanceEntryDialog';

import { Card } from '@/components/ui/card';
import { useState } from 'react';
type FinanceEntry = {
  id?: string;
  title?: string;
  amount?: number;
};
type IncomeListCardProps = {
  label: string;
};
export const IncomeListCard: React.FC<IncomeListCardProps> = ({ label }) => {
  const [entry, setEntry] = useState<FinanceEntry[]>([]);
  const handleAddFinanceEntry = (entry: FinanceEntry) => {
    console.log('New entry added', entry);
    // when the user adds a new entry, the title and amount will be displayed in h3 and p tags

    setEntry((prev) => [...prev, entry]);
  };

  return (
    <Card className="p-4 w-[300px]">
      <h1>{label}</h1>
      {entry &&
        entry.map((entryItem) => {
          return (
            <div key={entryItem.id} className="flex flex-col text-center gap-2">
              <h3 className="opacity-50">{entryItem.title}</h3>
              <p className="text-3xl">{entryItem.amount}</p>
            </div>
          );
        })}

      <FinanceEntryDialog variant="Salary" onAdd={handleAddFinanceEntry} />
    </Card>
  );
};
