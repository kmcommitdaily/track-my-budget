'use client';
import { FinanceEntryTypes, VariantTypeKey } from '@/components/types';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type FinanceEntryDialogProps = {
  variant: VariantTypeKey;
  onAdd?: (entry: FinanceEntryTypes) => void;
};

export const FinanceEntryDialog: React.FC<FinanceEntryDialogProps> = ({
  variant,
  onAdd,
}) => {
  // For SALARY, we use companyName instead of title.
  const [companyName, setCompanyName] = useState('');
  const [amount, setAmount] = useState<number | ''>(0);

  const handleSave = async () => {
    if (variant === 'SALARY' && !companyName) {
      console.error('Missing company name!');
      return;
    }
    if (!amount) {
      console.error('Missing amount!');
      return;
    }

    console.log('Saving entry:', { companyName, amount });

    // Send the correct property based on variant
    await onAdd?.({
      id: Math.random().toString(36),
      ...(variant === 'SALARY'
        ? { companyName } // For salary, send companyName
        : { title: companyName }), // For category, you might use title
      amount: Number(amount),
    });

    console.log('Entry added! Fetching new data...');
    setCompanyName('');
    setAmount(0);
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-red-400" asChild>
        <Button>{variant === 'SALARY' ? 'Add Income' : 'Add Category'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {variant === 'SALARY' ? 'Income' : 'Category'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="companyName" className="text-right">
              {variant === 'SALARY' ? 'Company Name' : 'Category Title'}
            </Label>
            <Input
              id="companyName"
              className="col-span-3"
              onChange={(e) => setCompanyName(e.target.value)}
              value={companyName}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              {variant === 'SALARY' ? 'Salary' : 'Budget'}
            </Label>
            <Input
              id="amount"
              className="col-span-3"
              type="number"
              onChange={(e) =>
                setAmount(e.target.value ? Number(e.target.value) : '')
              }
              value={amount}
            />
          </div>
          <DialogFooter>
            <Button className="w-100" variant="outline" onClick={handleSave}>
              save
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
