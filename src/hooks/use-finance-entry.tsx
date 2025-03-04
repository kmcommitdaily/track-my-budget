'use client';
import { createContext, useContext, useState } from 'react';

type FinanceEntry = {
  id?: string;
  title?: string;
  amount?: number;
};
const FinanceEntryContext = createContext<{
  entries: {Salary: FinanceEntry[]; Category: FinanceEntry[]};
  addEntry: (variant: "Salary" | "Category", newEntry: FinanceEntry) => void;
} | null>(null);

export const FinanceEntryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [entries, setEntries] = useState<{Salary: FinanceEntry[]; Category: FinanceEntry[]}>({Salary:[], Category: [],});
  const addEntry = (variant: "Salary" | "Category", newEntry: FinanceEntry) => {
    setEntries((prev) => ({
        ...prev,
        [variant]: [...prev[variant], { ...newEntry, id: Date.now().toString() }],
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
