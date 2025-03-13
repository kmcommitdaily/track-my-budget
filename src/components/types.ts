export type FinanceEntryTypes = {
  id: string;
  companyName?: string;
  amount?: number;
};

export const VARIANT = {
  SALARY: 'Salary',
  CATEGORY: 'Category',
} as const;

export type VariantTypeKey = keyof typeof VARIANT;
