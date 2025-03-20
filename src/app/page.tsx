'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/common/dashboard-layout';
import { FinanceProvider } from '@/components/common/finance-context';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <FinanceProvider>
      <DashboardLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </FinanceProvider>
  );
}
