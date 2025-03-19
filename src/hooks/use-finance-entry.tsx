'use client';

import { FinanceEntryTypes, VARIANT, VariantTypeKey } from '@/components/types';
import { createContext, useContext, useEffect, useState } from 'react';

// ✅ Define Salary Type to avoid implicit 'any' errors
type VariantTypeValue = (typeof VARIANT)[VariantTypeKey];
type EntriesType = Record<VariantTypeValue, FinanceEntryTypes[]>;

const FinanceEntryContext = createContext<{
  entries: EntriesType;
  addEntry: (
    variant: VariantTypeKey,
    newEntry: FinanceEntryTypes
  ) => Promise<void>;
  removeEntry: (deletedId: string) => void;
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

  const removeEntry = (deletedId: string) => {
    setEntries((prev) => ({
      ...prev,
      [VARIANT['SALARY']]: prev[VARIANT['SALARY']].filter(
        (entry) => entry.id !== deletedId
      ),
    }));
  };

  // ✅ Fetch salaries from API with proper typing
  const fetchSalaries = async () => {
    try {
      console.log('Fetching salaries...');
      const res = await fetch('/api/finance');
      // Read response as text to check for empty body
      const text = await res.text();
      const salaries: FinanceEntryTypes[] = text ? JSON.parse(text) : [];
      console.log('Salaries fetched:', salaries);
      setEntries((prev) => ({
        ...prev,
        [VARIANT.SALARY]: salaries.map((s: FinanceEntryTypes) => ({
          id: s.id,
          companyName: s.companyName ?? 'Unknown Company',
          amount: Number(s.amount) || 0,
        })),
      }));
    } catch (error) {
      console.error('Error fetching salaries:', error);
    }
  };

  useEffect(() => {
    fetchSalaries(); // ✅ Fetch existing salaries on first render
  }, []);

  // ✅ Add new salary entry and refetch from DB
  const addEntry = async (
    variant: VariantTypeKey,
    newEntry: FinanceEntryTypes
  ) => {
    console.log('Adding new entry:', newEntry); // ✅ Debugging log

    if (variant === 'SALARY') {
      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: newEntry.companyName,
          amount: newEntry.amount,
        }),
      });

      if (!res.ok) {
        console.error('Failed to add entry:', await res.text());
        return;
      }

      console.log('Salary added! Fetching updated salaries...'); // ✅ Debugging log
      await fetchSalaries(); // 🚀 Ensure UI updates immediately
    } else {
      const entryWithId: FinanceEntryTypes = {
        ...newEntry,
        id: newEntry.id || Date.now().toString(),
      };

      setEntries((prev) => ({
        ...prev,
        [VARIANT[variant]]: [...prev[VARIANT[variant]], entryWithId],
      }));
    }
  };

  return (
    <FinanceEntryContext.Provider value={{ entries, addEntry, removeEntry }}>
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
