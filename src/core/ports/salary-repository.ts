/**
 * Salary Repository Port
 * Interface for salary/income data access operations
 */

import type { Salary } from "../entities/salary";

export type SalaryWithCompany = {
  id: string;
  amount: number;
  company: string;
  companyId: string;
  userId: string;
  month: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SalaryRepository = {
  findById: (id: string) => Promise<Salary | null>;
  findByUserId: (
    userId: string,
    month?: string
  ) => Promise<SalaryWithCompany[]>;
  create: (salary: Salary) => Promise<Salary>;
  delete: (id: string, userId: string) => Promise<boolean>;
};
