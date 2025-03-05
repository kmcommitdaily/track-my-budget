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
        <div className="border w-full grid grid-cols-1 gap-4 p-4">
          <div className="flex justify-between gap-2 w-full">
            <div className="">
              <CalendarDemo />
            </div>
            <div className="">
              <DashboardCategoryWidget variant="CATEGORY" />
            </div>

            <div className=" flex-1 border ">
              <Card></Card>
            </div>
          </div>
          <div>
            <DashboardNotes />
            <div></div>
          </div>
        </div>
      </div>
    </FinanceEntryProvider>
  );
}
