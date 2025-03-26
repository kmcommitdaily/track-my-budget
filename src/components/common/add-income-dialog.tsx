'use client';

import type React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSalaries } from '@/hooks/use-salaries'; // ✅ use your query hook

interface AddIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddIncomeDialog({ open, onOpenChange }: AddIncomeDialogProps) {
  const [company, setCompany] = useState('');
  const [amount, setAmount] = useState('');

  const { createSalary, isCreating } = useSalaries(); // ✅ from query hook

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!company.trim() || !amount.trim()) {
      alert('❌ Please enter a valid company name and amount.');
      return;
    }

    createSalary(
      {
        companyName: company,
        amount: parseFloat(amount),
      },
      {
        onSuccess: () => {
          setCompany('');
          setAmount('');
          onOpenChange(false); // ✅ closes dialog
        },
        onError: (err) => {
          alert(err.message || 'Something went wrong.');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Company Title</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Salary</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Adding...' : 'Add Income'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
