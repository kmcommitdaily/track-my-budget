'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCategoryWithBudget } from '@/hooks/use-category-with-budget';
import { useItemExpenses } from '@/hooks/use-item-expenses';

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddExpenseDialog({
  open,
  onOpenChange,
}: AddExpenseDialogProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const { data: categories } = useCategoryWithBudget();
  const { createItemExpenses } = useItemExpenses();

  const selectedCategory = categories?.find((c) => c.categoryId === categoryId);
  const remainingBudget = selectedCategory
    ? Number(selectedCategory.remainingAmount)
    : 0;

  useEffect(() => {
    if (!open) {
      setTitle('');
      setAmount('');
      setCategoryId('');
      setError(null);
      setWarning(null);
    }
  }, [open]);

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setWarning(null);

    const expenseAmount = Number.parseFloat(amount);

    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }

    if (expenseAmount > remainingBudget) {
      setWarning(
        `This expense will exceed your budget for ${selectedCategory?.categoryTitle}. You only have ₱${remainingBudget.toLocaleString()} left.`
      );
    }

    createItemExpenses({
      itemName: title,
      categoryId,
      price: expenseAmount,
    });

    setTitle('');
    setAmount('');
    setCategoryId('');
    setError(null);
    setWarning(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Record a new expense in your budget.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={validateAndSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {warning && (
            <Alert
              variant="destructive"
              className="mb-4 border-warning bg-warning/20">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning-foreground">
                {warning}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Item</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter expense title"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={categoryId}
                onValueChange={(value) => {
                  setCategoryId(value);
                  setError(null);
                  setWarning(null);
                }}
                required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.length ? (
                    categories.map((category) => (
                      <SelectItem key={category.categoryId} value={category.categoryId}>
                        {category.categoryTitle} (₱
                        {Number(category.remainingAmount).toLocaleString()} left)
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No categories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Price</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setWarning(null);
                }}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                required
              />
              {categoryId && (
                <p className="text-xs text-muted-foreground">
                  Available in this category: ₱
                  {remainingBudget.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={!categories || categories.length === 0}>
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
