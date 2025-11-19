/**
 * Company Repository Port
 * Interface for company data access operations
 */

import type { Company } from "../entities/company";

export type CompanyRepository = {
  findById: (id: string) => Promise<Company | null>;
  findByName: (name: string) => Promise<Company | null>;
  create: (company: Company) => Promise<Company>;
};
