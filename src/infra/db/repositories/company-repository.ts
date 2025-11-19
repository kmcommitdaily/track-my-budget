/**
 * Company Repository Implementation
 * Implements CompanyRepository port using Drizzle ORM
 */

import { eq } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import type { CompanyRepository } from "@/core/ports/company-repository";
import type { Company } from "@/core/entities/company";
import { mapCompanyToEntity, mapCompanyToDb } from "../mappers/company-mapper";

/**
 * Creates a company repository instance
 */
export function createCompanyRepository(): CompanyRepository {
  return {
    findById: async (id: string): Promise<Company | null> => {
      const [row] = await db
        .select()
        .from(schema.companyTable)
        .where(eq(schema.companyTable.id, id))
        .limit(1);

      return row ? mapCompanyToEntity(row) : null;
    },

    findByName: async (name: string): Promise<Company | null> => {
      const [row] = await db
        .select()
        .from(schema.companyTable)
        .where(eq(schema.companyTable.name, name))
        .limit(1);

      return row ? mapCompanyToEntity(row) : null;
    },

    create: async (company: Company): Promise<Company> => {
      const [row] = await db
        .insert(schema.companyTable)
        .values(mapCompanyToDb(company))
        .returning();

      if (!row) {
        throw new Error("Failed to create company");
      }

      return mapCompanyToEntity(row);
    },
  };
}
