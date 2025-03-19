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
  const [companyName, setCompanyName] = useState('');
  const [amount, setAmount] = useState<number | ''>(0);
  const [open, setOpen] = useState(false); // ✅ Fix: Control Dialog Open State

  const handleSave = async () => {
    if (variant === 'SALARY' && !companyName) {
      console.error('❌ Missing company name!');
      return;
    }
    if (!amount) {
      console.error('❌ Missing amount!');
      return;
    }

    console.log('✅ Saving entry:', { companyName, amount });

    // ✅ Ensure `onAdd` updates parent state
    onAdd?.({
      id: crypto.randomUUID(), // ✅ Fix: Ensure Unique ID
      ...(variant === 'SALARY'
        ? { companyName } // ✅ Send correct field
        : { title: companyName }),
      amount: Number(amount),
    });

    console.log('✅ Entry added! Fetching new data...');
    setCompanyName('');
    setAmount(0);
    setOpen(false); // ✅ Fix: Close Dialog on Save
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          {variant === 'SALARY' ? 'Add Income' : 'Add Category'}
        </Button>
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
              Save
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
