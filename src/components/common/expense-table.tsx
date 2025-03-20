// 'use client';

// import { format } from 'date-fns';
// import { Trash2 } from 'lucide-react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { useFinance } from '../common/finance-context';
// import { useState } from 'react';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';

'use client';

import { format } from 'date-fns';
import { AlertTriangle, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useFinance } from '../../hooks/finance-context';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ExpenseTable() {
  const { expenses, getCategoryById, deleteExpense, getCategoryRemaining } =
    useFinance();
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="w-[80px]">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length > 0 ? (
              expenses.map((expense) => {
                const category = getCategoryById(expense.categoryId);
                const remaining = category
                  ? getCategoryRemaining(category.id)
                  : 0;
                const isBudgetExceeded = remaining < 0;

                return (
                  <TableRow
                    key={expense.id}
                    className={isBudgetExceeded ? 'bg-destructive/10' : ''}>
                    <TableCell>{format(expense.date, 'MMM d, yyyy')}</TableCell>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell>{category?.title || 'Unknown'}</TableCell>
                    <TableCell className="text-right">
                      ₱{expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {isBudgetExceeded && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center text-destructive">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                <span className="text-xs">Exceeded</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Budget exceeded by ₱
                                {Math.abs(remaining).toLocaleString()}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setDeleteExpenseId(expense.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete Expense</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground">
                  No expenses added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleteExpenseId}
        onOpenChange={(open) => !open && setDeleteExpenseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete this expense.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteExpenseId) {
                  deleteExpense(deleteExpenseId);
                  setDeleteExpenseId(null);
                }
              }}
              className="bg-destructive text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
