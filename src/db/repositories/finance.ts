import { eq } from 'drizzle-orm';
import { db } from '../index';
import * as schema from '../schema';
import { createCompany } from '../repositories/company'; // Ensure correct path

/** Generates timestamps for record creation & updates */
const getTimestamps = () => ({
  created_at: new Date(),
  updated_at: new Date(),
});

/**
 * Creates a salary record and ensures it is linked to a company & user.
 * @param userId - The ID of the user.
 * @param companyName - The name of the company.
 * @param amount - The salary amount.
 * @returns The salary ID if created, otherwise null.
 */


export const getSalaries = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('❌ User ID is required.');
    }

    // 🔹 Fetch salaries with company name
    const salaries = await db
      .select({
        id: schema.salaryTable.id,
        amount: schema.salaryTable.amount,
        company: schema.companyTable.name,
      })
      .from(schema.salaryTable)
      .innerJoin(
        schema.companyTable,
        eq(schema.salaryTable.company_id, schema.companyTable.id)
      )
      .where(eq(schema.salaryTable.user_id, userId));

    return salaries;
  } catch (error) {
    console.error('🔥 Failed to fetch salaries:', error);
    return [];
  }
};
export const createSalary = async (
  userId: string,
  companyName: string,
  amount: number
): Promise<string | null> => {
  try {
    // 🔹 Validate inputs
    if (!userId || !companyName?.trim() || amount <= 0) {
      console.error('❌ Invalid input:', { userId, companyName, amount });
      throw new Error(
        'All fields (userId, companyName, amount) are required and must be valid.'
      );
    }

    // 🔹 Ensure company exists (Create if needed)
    let companyId: string | null;
    const existingCompany = await db
      .select()
      .from(schema.companyTable)
      .where(eq(schema.companyTable.name, companyName))
      .limit(1);

    if (existingCompany.length > 0) {
      companyId = existingCompany[0].id;
    } else {
      console.log(
        `🏢 Company "${companyName}" not found, creating a new one...`
      );
      companyId = await createCompany(companyName);
    }

    if (!companyId) {
      throw new Error('❌ Failed to retrieve or create company.');
    }

    // 🔹 Transaction: Insert Salary + Link to Income Transactions
    return await db.transaction(async (tx) => {
      // 🔹 Insert salary
      const [salary] = await tx
        .insert(schema.salaryTable)
        .values({
          id: crypto.randomUUID(),
          amount: amount.toString(), // Convert to string for numeric type in Drizzle
          company_id: companyId,
          user_id: userId,
          ...getTimestamps(),
        })
        .returning({ id: schema.salaryTable.id });

      if (!salary?.id) {
        throw new Error('❌ Failed to insert salary.');
      }

      // 🔹 Insert into Income Transactions
      await tx.insert(schema.incomeTransactionsTable).values({
        user_id: userId,
        salary_id: salary.id,
        company_id: companyId,
      });

      console.log(`✅ Salary created successfully: ${salary.id}`);
      return salary.id;
    });
  } catch (error) {
    console.error('🔥 Failed to create salary:', error);
    return null;
  }
};
