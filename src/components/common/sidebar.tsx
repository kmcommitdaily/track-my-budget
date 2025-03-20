'use client';

import { useState } from 'react';
import { PlusCircle, DollarSign, Wallet, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AddIncomeDialog } from '../common/add-income-dialog';
import { AddCategoryDialog } from '../common/add-category-dialog';
import { useFinance } from '../common/finance-context';
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

  const {
    income,
    categories,
    getCategorySpent,
    getCategoryRemaining,
    deleteIncome,
    deleteCategory,
  } = useFinance();

  const handleDeleteClick = (id: string, type: 'income' | 'category') => {
    setDeleteItemId(id);
    setDeleteItemType(type);
  };

  const handleConfirmDelete = () => {
    if (!deleteItemId || !deleteItemType) return;

    if (deleteItemType === 'income') {
      deleteIncome(deleteItemId);
    } else if (deleteItemType === 'category') {
      deleteCategory(deleteItemId);
    }

    setDeleteItemId(null);
    setDeleteItemType(null);
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

              {categories.length > 0 ? (
                <div className="space-y-2">
                  {categories.map((category) => {
                    const spent = getCategorySpent(category.id);
                    const remaining = getCategoryRemaining(category.id);
                    const percentage =
                      category.budget > 0
                        ? Math.min(
                            100,
                            Math.round((spent / category.budget) * 100)
                          )
                        : 0;

                    return (
                      <div
                        key={category.id}
                        className="rounded-md border p-3 relative group">
                        <div className="font-medium">{category.title}</div>
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>
                            Budget: ₱{category.budget.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            {showRemaining ? (
                              <>
                                <Wallet className="h-3 w-3 mr-1" />₱
                                {remaining.toLocaleString()}
                              </>
                            ) : (
                              <>
                                <DollarSign className="h-3 w-3 mr-1" />₱
                                {spent.toLocaleString()}
                              </>
                            )}
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
                            handleDeleteClick(category.id, 'category')
                          }>
                          <Trash2 className="h-3 w-3 text-destructive" />
                          <span className="sr-only">Delete Category</span>
                        </Button>
                      </div>
                    );
                  })}
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
        onOpenChange={(open) => !open && setDeleteItemId(null)}>
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
    </>
  );
}
