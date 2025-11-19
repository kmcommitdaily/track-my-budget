/**
 * Salary Mapper
 * Maps between database models and domain entities
 */

import type { Salary } from "@/core/entities/salary";

type SalaryRow = {
  id: string;
  amount: string | null;
  company_id: string;
  user_id: string;
  month: string;
  created_at: Date | null;
  updated_at: Date | null;
};

/**
 * Maps database row to domain entity
 */
export function mapSalaryToEntity(row: SalaryRow): Salary {
  return {
    id: row.id,
    amount: Number(row.amount || 0),
    companyId: row.company_id,
    userId: row.user_id,
    month: row.month,
    createdAt: row.created_at || new Date(),
    updatedAt: row.updated_at || new Date(),
  };
}

/**
 * Maps domain entity to database insert values
 */
export function mapSalaryToDb(entity: Salary) {
  return {
    id: entity.id,
    amount: entity.amount.toString(),
    company_id: entity.companyId,
    user_id: entity.userId,
    month: entity.month,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
}
