// Sidebar.tsx
'use client';

import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AddIncomeDialog } from '../common/add-income-dialog';
import { AddCategoryDialog } from '../common/add-category-dialog';
// import { Switch } from '@/components/ui/switch';
// import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

import { useCategoryWithBudget } from '@/hooks/use-category-with-budget';
import { useSalaries } from '@/hooks/use-salaries';

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  // const [showRemaining, setShowRemaining] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemType, setDeleteItemType] = useState<
    'income' | 'category' | null
  >(null);
  const [showWarning, setShowWarning] = useState<string | null>(null);

  const {
    data: budgets,
    isLoading: isBudgetLoading,
    error: budgetError,
    deleteCategory,
  } = useCategoryWithBudget();

  const {
    data: income,
    isLoading: isIncomeLoading,
    error: incomeError,
    deleteSalary,
  } = useSalaries();

  const resetDeleteState = () => {
    setDeleteItemId(null);
    setDeleteItemType(null);
  };

  const handleDeleteClick = (id: string, type: 'income' | 'category') => {
    if (type === 'income' && income) {
      const remainingIncome = income
        .filter((i) => i.id !== id)
        .reduce((sum, i) => sum + i.amount, 0);

      const totalBudget =
        budgets?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;

      if (remainingIncome < totalBudget) {
        setShowWarning(
          '⚠️ Your income will be less than your budget if you delete this. Fix your budget first.'
        );
        return;
      }

      if (income.length === 1 && totalBudget > 0) {
        setShowWarning(
          "⚠️ You can't delete your only income source while a budget exists."
        );
        return;
      }
    }

    setDeleteItemId(id);
    setDeleteItemType(type);
  };

  const handleConfirmDelete = () => {
    if (!deleteItemId || !deleteItemType) return;


    if (deleteItemType === 'income') {
      deleteSalary(deleteItemId, {
        onSuccess: resetDeleteState,
      });
    } else if (deleteItemType === 'category') {
      deleteCategory(deleteItemId, {
        onSuccess: resetDeleteState,
      });
    }
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } h-screen`}>
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Income Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Income</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIncomeDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4" />
                  <span className="sr-only">Add Income</span>
                </Button>
              </div>

              {income && income.length > 0 ? (
                <div className="space-y-2">
                  {income.map((inc) => (
                    <div
                      key={inc.id}
                      className="rounded-md border p-3 relative group">
                      <div className="font-medium">{inc.company}</div>
                      <div className="text-sm text-muted-foreground">
                        ₱{inc.amount.toLocaleString()}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteClick(inc.id, 'income')}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : isIncomeLoading ? (
                <div className="text-sm text-muted-foreground">
                  Loading income…
                </div>
              ) : incomeError ? (
                <div className="text-sm text-destructive">
                  {incomeError.message}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No income added yet.
                </div>
              )}
            </div>

            <Separator className="my-4" />

            {/* Categories Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Categories</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCategoryDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>

              {/* FOR FUTURE FEATURE
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  id="budget-toggle"
                  checked={showRemaining}
                  onCheckedChange={setShowRemaining}
                />
                <Label htmlFor="budget-toggle" className="text-sm">
                  {showRemaining ? 'Remaining' : 'Spent'}
                </Label>
              </div> */}

              {budgets && budgets.length > 0 ? (
                <div className="space-y-2">
                  {budgets.map((budget) => (
                    <div
                      key={budget.id}
                      className="rounded-md border p-3 relative group">
                      <div className="font-medium">{budget.categoryTitle}</div>
                      <div className="text-sm text-muted-foreground">
                        Budget: ₱{Number(budget.amount).toLocaleString()}
                      </div>
                      <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `100%` }}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() =>
                          handleDeleteClick(budget.categoryId, 'category')
                        }>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : isBudgetLoading ? (
                <div className="text-sm text-muted-foreground">
                  Loading categories…
                </div>
              ) : budgetError ? (
                <div className="text-sm text-destructive">
                  {budgetError.message}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No categories added yet.
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </aside>

      <AddIncomeDialog
        open={incomeDialogOpen}
        onOpenChange={setIncomeDialogOpen}
      />
      <AddCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
      />

      <AlertDialog
        open={!!deleteItemId}
        onOpenChange={(open) => !open && resetDeleteState()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteItemType === 'income'
                ? 'This will delete this income source.'
                : 'This will delete this category and all associated expenses.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!showWarning}
        onOpenChange={(open) => !open && setShowWarning(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Heads up</AlertDialogTitle>
            <AlertDialogDescription>{showWarning}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowWarning(null)}>
              Okay
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
