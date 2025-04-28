import { eq, and } from 'drizzle-orm';
import { db } from '../index';
import * as schema from '../schema';
import { createCompany } from '../repositories/company'; // Ensure correct path

/** Generates timestamps for record creation & updates */
const getTimestamps = () => ({
  created_at: new Date(),
  updated_at: new Date(),
});

const getCurrentMonth = () => {
  const date = new Date();
  return date.toISOString().slice(0, 7); // Format: YYYY-MM
};

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
        month: schema.salaryTable.month,
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
  amount: number,
  month: string = getCurrentMonth()
): Promise<string | null> => {
  try {
    // 🔹 Validate inputs
    if (!userId || !companyName?.trim() || amount <= 0 || !month) {
      console.error('❌ Invalid input:', { userId, companyName, amount, month });
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
          month: month,
          user_id: userId,
          ...getTimestamps(),
        })
        .returning({ id: schema.salaryTable.id });

      console.log('Attempted to insert salary:', salary);
      if (!salary?.id) {
        console.error('❌ Salary insertion failed:', salary);
        throw new Error('❌ Failed to insert salary.');
      }

      // 🔹 Insert into Income Transactions
      await tx.insert(schema.incomeTransactionsTable).values({
        user_id: userId,
        salary_id: salary.id,
        company_id: companyId,
        month: month,
      });

      console.log(`✅ Salary created successfully: ${salary.id}`);
      return salary.id;
    });
  } catch (error) {
    console.error('🔥 Failed to create salary:', error);
    return null;
  }
};

export const deleteSalary = async (
  salaryId: string,
  userId: string
): Promise<boolean> => {
  if (!salaryId || !userId) throw new Error('Missing salaryId or userId');

  await db.transaction(async (tx) => {
    // 🔹 Get the salary with company ID
    const [salary] = await tx
      .select({
        companyId: schema.salaryTable.company_id,
      })
      .from(schema.salaryTable)
      .where(eq(schema.salaryTable.id, salaryId));

    if (!salary) throw new Error('Salary not found');

    const companyId = salary.companyId;

    // 🔹 Get all distinct companies for this user
    const companies = await tx
      .selectDistinct({ companyId: schema.incomeTransactionsTable.company_id })
      .from(schema.incomeTransactionsTable)
      .where(eq(schema.incomeTransactionsTable.user_id, userId));

    if (companies.length <= 1) {
      // 🔹 Check if user has any budgets
      const budgets = await tx
        .select()
        .from(schema.budgetTable)
        .where(eq(schema.budgetTable.user_id, userId));

      if (budgets.length > 0) {
        throw new Error(
          'Cannot delete your only income source while a budget exists.'
        );
      }
    }

    // 🔹 Delete income transaction
    await tx
      .delete(schema.incomeTransactionsTable)
      .where(
        and(
          eq(schema.incomeTransactionsTable.user_id, userId),
          eq(schema.incomeTransactionsTable.salary_id, salaryId),
          eq(schema.incomeTransactionsTable.company_id, companyId)
        )
      );
    console.log('✅ Deleted income transaction');
    // 🔹 Delete salary
    await tx
      .delete(schema.salaryTable)
      .where(eq(schema.salaryTable.id, salaryId));
    console.log('✅ Deleted salary');
    // 🔹 Check if any other salaries exist for this company
    const otherSalaries = await tx
      .select()
      .from(schema.salaryTable)
      .where(eq(schema.salaryTable.company_id, companyId));

    if (otherSalaries.length === 0) {
      await tx
        .delete(schema.companyTable)
        .where(eq(schema.companyTable.id, companyId));
    }
    console.log('✅ Deleted company');
  });

  return true;
};
