import {FinanceEntryTypes} from '@/components/types';

type IncomeListProps = {
  entry: FinanceEntryTypes;
};

export const IncomeList: React.FC<IncomeListProps> = ({ entry }) => {
  return (
    <div className="text-center flex flex-col">
      <h3 className="opacity-50">{entry.title}</h3>
      <p className="text-3xl">{entry.amount}</p>
    </div>
  );
};
