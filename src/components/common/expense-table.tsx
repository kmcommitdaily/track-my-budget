'use client';

import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useFinance } from '@/components/common/finance-context';

export function ExpenseTable() {
  const { expenses, getCategoryById } = useFinance();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length > 0 ? (
            expenses.map((expense) => {
              const category = getCategoryById(expense.categoryId);

              return (
                <TableRow key={expense.id}>
                  <TableCell>{format(expense.date, 'MMM d, yyyy')}</TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{category?.title || 'Unknown'}</TableCell>
                  <TableCell className="text-right">
                    ${expense.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-6 text-muted-foreground">
                No expenses added yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
