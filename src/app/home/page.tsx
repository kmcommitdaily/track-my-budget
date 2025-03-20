'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/common/dashboard-layout';
import { FinanceProvider } from '@/components/common/finance-context';
import { SignoutButton } from '@/components/common/signout-button';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <FinanceProvider>
      <SignoutButton  />
      <DashboardLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </FinanceProvider>
  );
}
