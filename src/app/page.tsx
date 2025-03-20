"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FinanceProvider } from "@/components/finance-context"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <FinanceProvider>
      <DashboardLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </FinanceProvider>
  )
}

