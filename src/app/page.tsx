import { FinanceListWidget } from '@/components/common/finance-list-widget';
import { FinanceEntryProvider } from '@/hooks/use-finance-entry';
export default function Home() {
  return (
    <FinanceEntryProvider>
      <div className="flex gap-2 justify-center mx-auto w-screen p-4">
        <div className="container w-[20%]  my-3.5 grid gap-4 grid-rows-2">
          <FinanceListWidget variant="SALARY" />
          <FinanceListWidget variant="CATEGORY" />
        </div>
        <div className="border w-full">
          <div>
            <div></div>
            <div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </FinanceEntryProvider>
  );
}
