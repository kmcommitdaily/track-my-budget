import { FinanceListCard } from '@/components/common/FinanceListCard';
import { FinanceEntryProvider } from '@/hooks/use-finance-entry';
export default function Home() {
  return (
    <FinanceEntryProvider>
      <div className="flex gap-2 justify-center mx-auto w-screen p-4">
        <div className="container w-[20%]  my-3.5 grid gap-4 grid-rows-2">
          <FinanceListCard variant="Salary" />
          <FinanceListCard variant="Category" />
        </div>
        <div className="border w-full">
          <h3>main div</h3>
        </div>
      </div>
    </FinanceEntryProvider>
  );
}
