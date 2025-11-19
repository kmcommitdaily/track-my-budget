/**
 * Salary Repository Implementation
 * Implements SalaryRepository port using Drizzle ORM
 */

import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import type {
  SalaryRepository,
  SalaryWithCompany,
} from "@/core/ports/salary-repository";
import type { Salary } from "@/core/entities/salary";
import { mapSalaryToEntity, mapSalaryToDb } from "../mappers/salary-mapper";

/**
 * Creates a salary repository instance
 */
export function createSalaryRepository(): SalaryRepository {
  return {
    findById: async (id: string): Promise<Salary | null> => {
      const [row] = await db
        .select()
        .from(schema.salaryTable)
        .where(eq(schema.salaryTable.id, id))
        .limit(1);

      return row ? mapSalaryToEntity(row) : null;
    },

    findByUserId: async (
      userId: string,
      month?: string
    ): Promise<SalaryWithCompany[]> => {
      const rows = await db
        .select({
          id: schema.salaryTable.id,
          amount: schema.salaryTable.amount,
          companyId: schema.salaryTable.company_id,
          userId: schema.salaryTable.user_id,
          month: schema.salaryTable.month,
          createdAt: schema.salaryTable.created_at,
          updatedAt: schema.salaryTable.updated_at,
          companyName: schema.companyTable.name,
        })
        .from(schema.salaryTable)
        .innerJoin(
          schema.companyTable,
          eq(schema.salaryTable.company_id, schema.companyTable.id)
        )
        .where(
          month
            ? and(
                eq(schema.salaryTable.user_id, userId),
                eq(schema.salaryTable.month, month)
              )
            : eq(schema.salaryTable.user_id, userId)
        );

      return rows.map((row) => ({
        id: row.id,
        amount: Number(row.amount || 0),
        company: row.companyName || "",
        companyId: row.companyId,
        userId: row.userId,
        month: row.month,
        createdAt: row.createdAt || new Date(),
        updatedAt: row.updatedAt || new Date(),
      }));
    },

    create: async (salary: Salary): Promise<Salary> => {
      const [row] = await db
        .insert(schema.salaryTable)
        .values(mapSalaryToDb(salary))
        .returning();

      if (!row) {
        throw new Error("Failed to create salary");
      }

      return mapSalaryToEntity(row);
    },

    delete: async (id: string, userId: string): Promise<boolean> => {
      await db.delete(schema.salaryTable).where(eq(schema.salaryTable.id, id));
      return true;
    },
  };
}
