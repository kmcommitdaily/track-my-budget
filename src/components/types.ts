export type FinanceEntryTypes = {
  id: string;
  title?: string;
  amount?: number;
};


export const VARIANT = {
    SALARY: 'Salary',
    CATEGORY: 'Category'
}

export type VariantType = keyof typeof VARIANT