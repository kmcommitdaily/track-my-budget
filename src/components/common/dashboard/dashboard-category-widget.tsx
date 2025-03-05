'use client';
import { VARIANT, VariantType } from '@/components/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useFinanceEntry } from '@/hooks/use-finance-entry';

type DashboardCategoryWidgetProps = {
  variant: VariantType;
};

export const DashboardCategoryWidget: React.FC<
  DashboardCategoryWidgetProps
> = ({ variant }) => {
  const { entries } = useFinanceEntry();
  return (
    <Card className="p-4 w-[300px]">
      <h1>Categories</h1>
      <ul className=" grid grid-cols-4 gap-4">
        {entries[VARIANT[variant]].map((entry) => (
          <li key={entry.id}>
            <Badge variant="outline">{entry.title}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
};
