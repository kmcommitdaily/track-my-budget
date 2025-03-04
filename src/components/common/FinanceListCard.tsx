'use client';
import { FinanceEntryDialog } from '@/components/common/FinanceEntryDialog';
import clsx from 'clsx';

import { Card } from '@/components/ui/card';
import { useState } from 'react';
type FinanceEntry = {
  id?: string;
  title?: string;
  amount?: number;
};
type IncomeListCardProps = {
  variant: 'Salary' | 'Category';
};
export const FinanceListCard: React.FC<IncomeListCardProps> = ({ variant }) => {
  const [entry, setEntry] = useState<FinanceEntry[]>([]);
  const handleAddFinanceEntry = (entry: FinanceEntry) => {
    console.log('New entry added', entry);
    // when the user adds a new entry, the title and amount will be displayed in h3 and p tags

    setEntry((prev) => [...prev, entry]);
  };

  return (
    <Card className="p-4 w-[300px]">
      <h1>{variant === 'Salary' ? 'Income' : 'Categories'}</h1>
      {entry &&
        entry.map((entryItem) => {
          return (
            <div
              key={entryItem.id}
              className={clsx(
                'text-center ',
                variant === 'Salary'
                  ? 'flex flex-col '
                  : 'flex flex-row justify-between items-center'
              )}>
              <h3
                className={clsx(
                  variant === 'Salary' ? 'opacity-50' : 'font-bold'
                )}>
                {entryItem.title}
              </h3>
              <p
                className={clsx(variant === 'Salary' ? 'text-3xl' : 'text-md')}>
                {entryItem.amount}
              </p>
            </div>
          );
        })}
      {variant === 'Salary' ? (
        <FinanceEntryDialog variant="Salary" onAdd={handleAddFinanceEntry} />
      ) : (
        <FinanceEntryDialog variant="Category" onAdd={handleAddFinanceEntry} />
      )}
    </Card>
  );
};
