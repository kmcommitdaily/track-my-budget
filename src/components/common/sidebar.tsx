'use client';

import { useState } from 'react';
import { PlusCircle, DollarSign, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AddIncomeDialog } from '@/components/common/add-income-dialog';
import { AddCategoryDialog } from '@/components/common/add-category-dialog';
import { useFinance } from '@/components/common/finance-context';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [showRemaining, setShowRemaining] = useState(true);
  const { income, categories, getCategorySpent, getCategoryRemaining } =
    useFinance();

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>

        <ScrollArea className="flex-1">
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
                    <div key={inc.id} className="rounded-md border p-3">
                      <div className="font-medium">{inc.company}</div>
                      <div className="text-sm text-muted-foreground">
                        ${inc.amount.toLocaleString()}
                      </div>
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
                      <div key={category.id} className="rounded-md border p-3">
                        <div className="font-medium">{category.title}</div>
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                          <span>
                            Budget: ${category.budget.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            {showRemaining ? (
                              <>
                                <Wallet className="h-3 w-3 mr-1" />$
                                {remaining.toLocaleString()}
                              </>
                            ) : (
                              <>
                                <DollarSign className="h-3 w-3 mr-1" />$
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
    </>
  );
}
