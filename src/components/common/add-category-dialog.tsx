'use client';

'use client';

import type React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
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
import { useFinance } from '@/hooks/finance-context';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCategoryDialog({
  open,
  onOpenChange,
}: AddCategoryDialogProps) {
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { getTotalIncome, getTotalBudget } = useFinance();
  const mutation = useMutation({
    mutationFn: async (newCategory: {
      categoryTitle: string;
      amount: number;
    }) => {
      const response = await fetch('/api/category-budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add Category');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget'] });
    },
  });

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const totalIncome = getTotalIncome();
    const totalBudget = getTotalBudget();
    const budgetAmount = Number.parseFloat(budget);
    if (totalIncome <= 0) {
      setError('You need to add income before creating a budget category.');
      return;
    }

    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      setError('Please enter a valid budget amount greater than zero.');
      return;
    }

    const remainingIncome = totalIncome - totalBudget;
    if (budgetAmount > remainingIncome) {
      setError(
        `Budget exceeds remaining income. You have $${remainingIncome.toLocaleString()} available.`
      );
      return;
    }

    mutation.mutate(
      { categoryTitle: title, amount: budgetAmount },
      {
        onSuccess: () => {
          setTitle('');
          setBudget('');
          onOpenChange(false);
        },
        onError: (error) => {
          setError(error.message || 'Something went wrong. Pls try again');
        },
      }
    );
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Create a budget category to track your expenses.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={validateAndSubmit}>
          {mutation.isPending && <p>Adding category...</p>}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter category title"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter budget amount"
                min="0"
                step="0.01"
                required
              />
              <p className="text-xs text-muted-foreground">
                Available income: $
                {(getTotalIncome() - getTotalBudget()).toLocaleString()}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              Add Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
