import { Card } from '@/components/ui/card';

export const DashboardNotes: React.FC = async () => {
  return (
    <Card className="bg-white p-4 rounded-md shadow-md w-[300px] ">
      <h1 className="text-lg font-bold">Notes</h1>
      <textarea
        className="text-gray-500 text-sm w-full min-h-[300px] resize-y p-2"
        name=""
        id=""></textarea>
    </Card>
  );
};
