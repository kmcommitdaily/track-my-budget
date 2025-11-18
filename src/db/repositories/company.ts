import { eq } from 'drizzle-orm';
import { db } from '../index';
import * as schema from '../schema';



/**
 * Creates a company if it doesn't exist, otherwise returns the existing company's ID.
 * @param companyName - The name of the company.
 * @returns The company's ID or null if creation fails.
 */
export const createCompany = async (companyName: string): Promise<string | null> => {
  try {
    if (!companyName?.trim()) {
      throw new Error('Company name cannot be empty.');
    }

    // 🔹 Check if the company already exists
    const existingCompany = await db
      .select()
      .from(schema.companyTable)
      .where(eq(schema.companyTable.name, companyName))
      .limit(1);

    if (existingCompany.length > 0) {

      return existingCompany[0].id;
    }

    // 🔹 Insert new company
    const [newCompany] = await db
      .insert(schema.companyTable)
      .values({ id: crypto.randomUUID(), name: companyName })
      .returning({ id: schema.companyTable.id });

    if (!newCompany?.id) {
      throw new Error('Failed to create company.');
    }


    return newCompany.id;
  } catch (error) {
    console.error('🔥 Error creating company:', error);
    return null;
  }
};
