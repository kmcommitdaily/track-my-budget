'use client';
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
type FinanceEntry = {
  id?: string;
  title?: string;
  amount?: number;
};

type FinanceEntryDialogProps = {
  open?: boolean;
  onClose?: () => void;
  variant: 'Salary' | 'Category';
  onAdd?: (entry: FinanceEntry) => void;
};

export const FinanceEntryDialog: React.FC<FinanceEntryDialogProps> = ({
  variant,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>(0);

  const handleSave = () => {
    if (!title || !amount) return;

    onAdd?.({ id: Math.random().toString(36), title, amount: Number(amount) });

    setTitle('');
    setAmount(0);
  };
  return (
    <Dialog>
      <DialogTrigger className="bg-red-400" asChild>
        <Button>{variant === 'Salary' ? 'Add Income' : 'Add Category'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {variant === 'Salary' ? 'Income' : 'Category'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {variant === 'Salary' ? 'Company' : 'Category Title'}
            </Label>
            <Input
              id="name"
              className="col-span-3"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              {variant === 'Salary' ? 'Salary' : 'Budget'}
            </Label>
            <Input
              id="username"
              className="col-span-3"
              type="number"
              onChange={(e) =>
                setAmount(e.target.value ? Number(e.target.value) : '')
              }
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
