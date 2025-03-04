'use client';
import { FinanceEntryDialog } from '@/components/common/FinanceEntryDialog';
import { Card } from '@/components/ui/card';
import { useFinanceEntry } from '@/hooks/use-finance-entry';
import clsx from 'clsx';
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
  const { entries, addEntry } = useFinanceEntry();

  return (
    <Card className="p-4 w-full">
      <h1>{variant === 'Salary' ? 'Income' : 'Categories'}</h1>
      {entries &&
        entries[variant].map((entryItem) => {
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
        <FinanceEntryDialog
          variant={variant}
          onAdd={(entry) => addEntry(variant, entry)}
        />
      ) : (
        <FinanceEntryDialog
          variant={variant}
          onAdd={(entry) => addEntry(variant, entry)}
        />
      )}
    </Card>
  );
};
