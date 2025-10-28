"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/common/dashboard-layout";

import { QueryProvider } from "@/hooks/query-context";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <QueryProvider>
      <DashboardLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </QueryProvider>
  );
}
