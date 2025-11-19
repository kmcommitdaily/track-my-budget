"use client";

import { format } from "date-fns";
import { AlertTriangle, Trash2, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useItemExpenses } from "@/hooks/expenses/queries/use-item-expenses";
import { useDeleteItemExpense } from "@/hooks/expenses/mutations/use-delete-item-expense";

export function ExpenseTable() {
  const { data: items = [] } = useItemExpenses();
  const { deleteItemExpense } = useDeleteItemExpense();
  const [deleteExpenseId, setDeleteExpenseId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Memoize filtered expenses to avoid recalculating on every render
  const filtered = useMemo(
    () =>
      categoryFilter === "all"
        ? items
        : items.filter((item) => item.categoryId === categoryFilter),
    [items, categoryFilter]
  );

  // Memoize sorted expenses to avoid re-sorting on every render
  const sorted = useMemo(
    () =>
      [...filtered].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [filtered]
  );

  // Memoize unique categories to avoid recalculating on every render
  const uniqueCategories = useMemo(
    () =>
      Array.from(
        new Map(items.map((i) => [i.categoryId, i.categoryTitle])).entries()
      ),
    [items]
  );

  return (
    <>
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map(([id, title]) => (
                <SelectItem key={id} value={id}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-[80px]">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length > 0 ? (
              sorted.map((item) => {
                const remaining = Number(item.remainingBudget);
                const isBudgetExceeded = remaining < 0;

                return (
                  <TableRow
                    key={item.id}
                    className={isBudgetExceeded ? "bg-destructive/10" : ""}
                  >
                    <TableCell>
                      {item.createdAt
                        ? format(new Date(item.createdAt), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{item.categoryTitle || "Unknown"}</TableCell>
                    <TableCell>₱{item.price.toLocaleString()}</TableCell>
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
                        onClick={() => setDeleteExpenseId(item.id)}
                      >
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
                  className="text-center py-6 text-muted-foreground"
                >
                  {items.length === 0
                    ? "No expenses added yet."
                    : "No expenses found for the selected category."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleteExpenseId}
        onOpenChange={(open) => !open && setDeleteExpenseId(null)}
      >
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
                  deleteItemExpense(deleteExpenseId, {
                    onSuccess: () => {
                      setDeleteExpenseId(null);
                    },
                  });
                }
              }}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
