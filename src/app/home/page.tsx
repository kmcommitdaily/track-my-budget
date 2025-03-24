'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/common/dashboard-layout';
import { FinanceProvider } from '@/hooks/finance-context';
import { QueryProvider } from '@/hooks/query-context';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <QueryProvider>
      <FinanceProvider>
        <DashboardLayout
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </FinanceProvider>
    </QueryProvider>
  );
}
