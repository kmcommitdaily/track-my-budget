import { SignOutButton } from '@/components/common/authentication/sign-out-button';
import { CalendarDemo } from '@/components/common/dashboard/calendar-demo';
import { DashboardCategoryWidget } from '@/components/common/dashboard/dashboard-category-widget';
import { DashboardNotes } from '@/components/common/dashboard/dashboard-notes';
import { FinanceListWidget } from '@/components/common/finance-list-widget';

import { Card } from '@/components/ui/card';
import { FinanceEntryProvider } from '@/hooks/use-finance-entry';
export default function Home() {
  return (
    <FinanceEntryProvider>
      <div className="flex gap-4 justify-center mx-auto w-screen p-4">
        <div className="container w-[20%]  grid gap-4 grid-cols-1">
          <FinanceListWidget variant="SALARY" />
          <FinanceListWidget variant="CATEGORY" />
        </div>
        <div className="border w-full grid grid-cols-1 gap-4 p-4 ">
          <div className="grid grid-cols-4  justify-items-center w-full gap-4 ">
            <div className="w-full ">
              <CalendarDemo />
            </div>
            <div className="w-full">
              <DashboardCategoryWidget variant="CATEGORY" />
            </div>

            <div className=" border col-span-2 w-full">
              <Card className="w-full">hello</Card>
            </div>
          </div>
          <div>
            <DashboardNotes />
            <div></div>
          </div>
        </div>
      </div>
      <div className="flex">
        <SignOutButton/>
      </div>
    </FinanceEntryProvider>
  );
}
