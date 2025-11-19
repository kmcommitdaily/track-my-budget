/**
 * Company Entity
 * Pure business logic for company domain model
 */

export type Company = {
  id: string;
  name: string;
};

/**
 * Creates a new company entity
 */
export function createCompany(name: string): Company {
  if (!name?.trim()) {
    throw new Error("Company name is required");
  }

  return {
    id: crypto.randomUUID(),
    name: name.trim(),
  };
}

/**
 * Validates company data
 */
export function validateCompany(company: Partial<Company>): boolean {
  return !!company.name?.trim();
}
