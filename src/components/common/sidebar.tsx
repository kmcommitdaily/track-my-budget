'use client';

import { useState } from 'react';
import { PlusCircle, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AddIncomeDialog } from '../common/add-income-dialog';
import { AddCategoryDialog } from '../common/add-category-dialog';
import { useFinance } from '../../hooks/finance-context';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import { Alert, AlertDescription } from '../ui/alert';
import { useBudget } from '@/hooks/use-budget';
import { useDeleteSalary } from '@/hooks/use-delete-salary'; // ✅ new hook

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [showRemaining, setShowRemaining] = useState(true);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleteItemType, setDeleteItemType] = useState<
    'income' | 'category' | null
  >(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { income, deleteIncome, deleteCategory } = useFinance();

  const {
    data: budgets,
    isLoading: isBudgetLoading,
    error: budgetError,
  } = useBudget();

  const { mutate: deleteSalary } = useDeleteSalary();

  const resetDeleteState = () => {
    setDeleteItemId(null);
    setDeleteItemType(null);
    setDeleteError(null);
  };

  const handleDeleteClick = (id: string, type: 'income' | 'category') => {
    setDeleteError(null);

    if (
      type === 'income' &&
      income.length === 1 &&
      budgets &&
      budgets.length > 0
    ) {
      setDeleteError(
        'Cannot delete the only income source when budget categories exist. Add another income source first or delete all categories.'
      );
      setDeleteItemId(id);
      setDeleteItemType(type);
      return;
    }

    setDeleteItemId(id);
    setDeleteItemType(type);
  };

  const handleConfirmDelete = () => {
    if (!deleteItemId || !deleteItemType || deleteError) {
      resetDeleteState();
      return;
    }

    if (deleteItemType === 'income') {
      deleteSalary(deleteItemId, {
        onSuccess: () => {
          deleteIncome(deleteItemId); // optional local state sync
          resetDeleteState();
        },
        onError: (err) => {
          setDeleteError(err.message);
        },
      });
    } else if (deleteItemType === 'category') {
      deleteCategory(deleteItemId);
      resetDeleteState();
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

              {income.length > 0 ? (
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
                        <span className="sr-only">Delete Income</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No income added yet.
                </div>
              )}
            </div>

            <Separator className="my-4" />

            {/* Categories Section (from useBudget) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Categories</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCategoryDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4" />
                  <span className="sr-only">Add Category</span>
                </Button>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  id="budget-toggle"
                  checked={showRemaining}
                  onCheckedChange={setShowRemaining}
                />
                <Label htmlFor="budget-toggle" className="text-sm">
                  {showRemaining ? 'Remaining' : 'Spent'}
                </Label>
              </div>

              {budgets && budgets.length > 0 ? (
                <div className="space-y-2">
                  {budgets.map((budget) => {
                    const percentage = 100; // Replace if you later track spent

                    return (
                      <div
                        key={budget.id}
                        className="rounded-md border p-3 relative group">
                        <div className="font-medium">
                          {budget.categoryTitle}
                        </div>
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>
                            Budget: ₱{Number(budget.amount).toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              percentage >= 100
                                ? 'bg-destructive'
                                : percentage > 75
                                ? 'bg-warning'
                                : 'bg-primary'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            handleDeleteClick(budget.id, 'category')
                          }>
                          <Trash2 className="h-3 w-3 text-destructive" />
                          <span className="sr-only">Delete Category</span>
                        </Button>
                      </div>
                    );
                  })}
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
        onOpenChange={(open) => {
          if (!open) resetDeleteState();
        }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteError ? 'Cannot Delete' : 'Are you sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteError ? (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{deleteError}</AlertDescription>
                </Alert>
              ) : deleteItemType === 'income' ? (
                'This will delete this income source.'
              ) : (
                'This will delete this category and all associated expenses.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {!deleteError && (
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
