'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Income = {
  id: string;
  company: string;
  amount: number;
};

export type Category = {
  id: string;
  title: string;
  budget: number;
};

export type Expense = {
  id: string;
  title: string;
  categoryId: string;
  amount: number;
  date: Date;
};

type FinanceContextType = {
  income: Income[];
  categories: Category[];
  expenses: Expense[];
  addIncome: (income: Omit<Income, 'id'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteIncome: (id: string) => void;
  deleteCategory: (id: string) => void;
  deleteExpense: (id: string) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getTotalBudget: () => number;
  getRemainingBudget: () => number;
  getRemainingIncome: () => number;
  getCategoryById: (id: string) => Category | undefined;
  getCategorySpent: (categoryId: string) => number;
  getCategoryRemaining: (categoryId: string) => number;
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [income, setIncome] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch salaries when component mounts
  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await fetch('/api/finance'); // Ensure correct API path
        const data = await response.json();

        if (response.ok) {
          setIncome(data.salaries); // Update state with fetched data
        } else {
          throw new Error(data.error || 'Failed to fetch salaries');
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, []);

  const addIncome = (newIncome: Omit<Income, 'id'>) => {
    setIncome([...income, { ...newIncome, id: crypto.randomUUID() }]);
  };

  const addCategory = (newCategory: Omit<Category, 'id'>) => {
    setCategories([...categories, { ...newCategory, id: crypto.randomUUID() }]);
  };

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    setExpenses([...expenses, { ...newExpense, id: crypto.randomUUID() }]);
  };

  const deleteIncome = (id: string) => {
    setIncome(income.filter((item) => item.id !== id));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id));
    setExpenses(expenses.filter((expense) => expense.categoryId !== id)); // Delete related expenses
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const getTotalIncome = () => {
    return income.reduce((total, inc) => total + Number(inc.amount), 0);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getTotalBudget = () => {
    return categories.reduce((total, category) => total + category.budget, 0);
  };

  const getRemainingBudget = () => {
    return getTotalBudget() - getTotalExpenses();
  };

  const getRemainingIncome = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getCategoryById = (id: string) => {
    return categories.find((category) => category.id === id);
  };

  const getCategorySpent = (categoryId: string) => {
    return expenses
      .filter((expense) => expense.categoryId === categoryId)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getCategoryRemaining = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    if (!category) return 0;
    return category.budget - getCategorySpent(categoryId);
  };

  return (
    <FinanceContext.Provider
      value={{
        income,
        categories,
        expenses,
        addIncome,
        addCategory,
        addExpense,
        deleteIncome,
        deleteCategory,
        deleteExpense,
        getTotalIncome,
        getTotalExpenses,
        getTotalBudget,
        getRemainingBudget,
        getRemainingIncome,
        getCategoryById,
        getCategorySpent,
        getCategoryRemaining,
      }}>
      {loading ? <p>Welcome back!..</p> : error ? <p>{error}</p> : children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
