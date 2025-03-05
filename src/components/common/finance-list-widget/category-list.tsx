import { FinanceEntryTypes } from '@/components/types';

type CategoryListProps = {
  entry: FinanceEntryTypes;
};

export const CategoryList: React.FC<CategoryListProps> = ({ entry }) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <h3 className="font-bold">{entry.title}</h3>
      <p className="text-md">{entry.amount}</p>
    </div>
  );
};
