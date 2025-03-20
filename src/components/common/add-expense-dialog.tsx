'use client';

import type React from 'react';

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
import { useFinance } from '@/components/common/finance-context';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AlertCircle, AlertTriangle, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [date, setDate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const { addExpense, categories, getCategoryRemaining, getCategoryById } =
    useFinance();

  // Reset form when dialog opens or closes
  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setTitle('');
      setAmount('');
      setCategoryId('');
      setDate(new Date());
      setError(null);
      setWarning(null);
    }
  }, [open]);

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setWarning(null);

    // Check if a category is selected
    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    const expenseAmount = Number.parseFloat(amount);

    // Check if amount is valid
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }

    // Check if expense exceeds remaining category budget (warning only)
    const remainingBudget = getCategoryRemaining(categoryId);
    const category = getCategoryById(categoryId);

    if (expenseAmount > remainingBudget) {
      setWarning(
        `This expense will exceed your budget for ${
          category?.title
        }. You only have $${remainingBudget.toLocaleString()} left.`
      );
      // Continue with submission - don't return
    }

    // Add the expense
    addExpense({
      title,
      amount: expenseAmount,
      categoryId,
      date,
    });

    // Reset form and close dialog
    setTitle('');
    setAmount('');
    setCategoryId('');
    setDate(new Date());
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
                  {categories.length > 0 ? (
                    categories.map((category) => {
                      const remaining = getCategoryRemaining(category.id);
                      return (
                        <SelectItem key={category.id} value={category.id}>
                          {category.title} (₱{remaining.toLocaleString()} left)
                        </SelectItem>
                      );
                    })
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

                  // Show warning if amount exceeds budget
                  if (categoryId) {
                    const inputAmount = Number.parseFloat(e.target.value);
                    const remaining = getCategoryRemaining(categoryId);
                    const category = getCategoryById(categoryId);

                    if (!isNaN(inputAmount) && inputAmount > remaining) {
                      setWarning(
                        `This expense will exceed your budget for ${
                          category?.title
                        }. You only have $${remaining.toLocaleString()} left.`
                      );
                    }
                  }
                }}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                required
              />
              {categoryId && (
                <p className="text-xs text-muted-foreground">
                  Available in this category: ₱
                  {getCategoryRemaining(categoryId).toLocaleString()}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={categories.length === 0}>
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
