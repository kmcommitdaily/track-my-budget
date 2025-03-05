'use client';
import { FinanceEntryTypes, VARIANT, VariantType } from '@/components/types';
import { createContext, useContext, useState } from 'react';

type EntriesType = Record<(typeof VARIANT)[VariantType], FinanceEntryTypes[]>;

const FinanceEntryContext = createContext<{
  entries: EntriesType;
  addEntry: (variant: VariantType, newEntry: FinanceEntryTypes) => void;
} | null>(null);

export const FinanceEntryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [entries, setEntries] = useState<EntriesType>({
    [VARIANT.SALARY]: [],
    [VARIANT.CATEGORY]: [],
  });

  const addEntry = (variant: VariantType, newEntry: FinanceEntryTypes) => {
    const entryWithId: FinanceEntryTypes = {
      ...newEntry,
      id: newEntry.id || Date.now().toString(), // Ensure `id` is assigned
    };

    setEntries((prev) => ({
      ...prev,
      [VARIANT[variant]]: [...prev[VARIANT[variant]], entryWithId],
    }));
  };

  return (
    <FinanceEntryContext.Provider value={{ entries, addEntry }}>
      {children}
    </FinanceEntryContext.Provider>
  );
};

export const useFinanceEntry = () => {
  const context = useContext(FinanceEntryContext);
  if (!context) {
    throw new Error(
      'useFinanceEntry must be used within a FinanceEntryProvider'
    );
  }
  return context;
};
