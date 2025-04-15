'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/common/sidebar';
import { CalendarCard } from '@/components/common/calendar-card';
import { SummaryCard } from '@/components/common/summary-card';
import { ExpenseTable } from '@/components/common/expense-table';

import { AddExpenseDialog } from '@/components/common/add-expense-dialog';
import { SignoutButton } from './signout-button';

interface DashboardLayoutProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function DashboardLayout({
  sidebarOpen,
  setSidebarOpen,
}: DashboardLayoutProps) {
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar open={sidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'md:ml-64' : ''
        }`}>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <h1 className="text-xl font-semibold">Financial Dashboard</h1>
          <SignoutButton />
        </header>

        <main className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-2">
          <div className="col-span-full lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              <CalendarCard />
              <SummaryCard />
            </div>
          </div>

          {/* <div className="col-span-full lg:col-span-1">
            <Notepad value={notes} onChange={setNotes} />
          </div> */}

          <div className="col-span-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Expenses</h2>
              <Button onClick={() => setExpenseDialogOpen(true)}>
                Add Expense
              </Button>
            </div>
            <ExpenseTable />
          </div>
        </main>
      </div>

      <AddExpenseDialog
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
      />
    </div>
  );
}
