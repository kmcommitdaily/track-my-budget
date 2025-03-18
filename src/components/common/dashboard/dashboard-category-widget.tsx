'use client';
import { VARIANT, VariantTypeKey } from '@/components/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useFinanceEntry } from '@/hooks/use-finance-entry';

type DashboardCategoryWidgetProps = {
  variant: VariantTypeKey;
};

export const DashboardCategoryWidget: React.FC<
  DashboardCategoryWidgetProps
> = ({ variant }) => {
  const { entries } = useFinanceEntry();
  return (
    <Card className="p-4 w-full">
      <h1>Categories</h1>
      <ul className=" grid grid-cols-4 gap-4 place-items-center">
        {entries[VARIANT[variant]].map((entry) => (
          <li key={entry.id}>
            <Badge variant="outline">{entry.companyName}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
};
