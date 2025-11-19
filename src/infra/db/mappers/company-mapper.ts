/**
 * Company Mapper
 * Maps between database models and domain entities
 */

import type { Company } from "@/core/entities/company";

type CompanyRow = {
  id: string;
  name: string | null;
};

/**
 * Maps database row to domain entity
 */
export function mapCompanyToEntity(row: CompanyRow): Company {
  return {
    id: row.id,
    name: row.name || "",
  };
}

/**
 * Maps domain entity to database insert values
 */
export function mapCompanyToDb(entity: Company) {
  return {
    id: entity.id,
    name: entity.name,
  };
}
