"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Income = {
  id: string
  company: string
  amount: number
}

export type Category = {
  id: string
  title: string
  budget: number
}

export type Expense = {
  id: string
  title: string
  categoryId: string
  amount: number
  date: Date
}

type FinanceContextType = {
  income: Income[]
  categories: Category[]
  expenses: Expense[]
  addIncome: (income: Omit<Income, "id">) => void
  addCategory: (category: Omit<Category, "id">) => void
  addExpense: (expense: Omit<Expense, "id">) => void
  getTotalIncome: () => number
  getTotalExpenses: () => number
  getTotalBudget: () => number
  getRemainingBudget: () => number
  getRemainingIncome: () => number
  getCategoryById: (id: string) => Category | undefined
  getCategorySpent: (categoryId: string) => number
  getCategoryRemaining: (categoryId: string) => number
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [income, setIncome] = useState<Income[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])

  const addIncome = (newIncome: Omit<Income, "id">) => {
    setIncome([...income, { ...newIncome, id: crypto.randomUUID() }])
  }

  const addCategory = (newCategory: Omit<Category, "id">) => {
    setCategories([...categories, { ...newCategory, id: crypto.randomUUID() }])
  }

  const addExpense = (newExpense: Omit<Expense, "id">) => {
    setExpenses([...expenses, { ...newExpense, id: crypto.randomUUID() }])
  }

  const getTotalIncome = () => {
    return income.reduce((total, inc) => total + inc.amount, 0)
  }

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0)
  }

  const getTotalBudget = () => {
    return categories.reduce((total, category) => total + category.budget, 0)
  }

  const getRemainingBudget = () => {
    return getTotalBudget() - getTotalExpenses()
  }

  const getRemainingIncome = () => {
    return getTotalIncome() - getTotalExpenses()
  }

  const getCategoryById = (id: string) => {
    return categories.find((category) => category.id === id)
  }

  const getCategorySpent = (categoryId: string) => {
    return expenses
      .filter((expense) => expense.categoryId === categoryId)
      .reduce((total, expense) => total + expense.amount, 0)
  }

  const getCategoryRemaining = (categoryId: string) => {
    const category = getCategoryById(categoryId)
    if (!category) return 0
    return category.budget - getCategorySpent(categoryId)
  }

  return (
    <FinanceContext.Provider
      value={{
        income,
        categories,
        expenses,
        addIncome,
        addCategory,
        addExpense,
        getTotalIncome,
        getTotalExpenses,
        getTotalBudget,
        getRemainingBudget,
        getRemainingIncome,
        getCategoryById,
        getCategorySpent,
        getCategoryRemaining,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return context
}

