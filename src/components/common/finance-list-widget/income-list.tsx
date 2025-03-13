import { FinanceEntryTypes } from '@/components/types';
import { Button } from '@/components/ui/button';
type IncomeListProps = {
  entry: FinanceEntryTypes;
  onDelete?: (id: string) => void;
};

export const IncomeList: React.FC<IncomeListProps> = ({ entry, onDelete }) => {
  const handleDelete = async () => {
    if (!entry.id) {
      console.error('Missing id!');
      return;
    }

    try {
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salaryId: entry.id }),
      });

      if (!response.ok) throw new Error('Failed to delete salary');

      console.log('✅ Salary deleted:', entry.id);
      onDelete?.(entry.id);
    } catch (error) {
      console.error('❌ Error deleting entry:', error);
    }
  };

  return (
    <div className="text-center flex flex-col">
      <Button
        onClick={handleDelete}
        className="w-[100px] ml-auto"
        variant="ghost">
        X
      </Button>
      <h3 className="opacity-50">{entry.companyName}</h3>
      <p className="text-3xl">{entry.amount}</p>
    </div>
  );
};
