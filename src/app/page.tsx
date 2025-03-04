import { FinanceListCard } from '@/components/common/FinanceListCard';

export default function Home() {
  return (
    <div className="container mx-auto my-3.5 grid gap-4 grid-rows-2">
      <FinanceListCard variant="Salary" />
      <FinanceListCard variant="Category" />
    </div>
  );
}
