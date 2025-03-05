type FinanceEntry = {
  id?: string;
  title?: string;
  amount?: number;
};
type CategoryListProps = {
  entry: FinanceEntry;
};

export const CategoryList: React.FC<CategoryListProps> = ({ entry }) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <h3 className="font-bold">{entry.title}</h3>
      <p className="text-md">{entry.amount}</p>
    </div>
  );
};
