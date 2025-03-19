import { eq } from 'drizzle-orm';
import { db } from '../index';
import * as schema from '../schema';

// const TEMP_USER_ID = '3e13d656-8e7f-4c94-b1dc-08cd98ef3c14'; // Use only if needed

// Create a company and return its ID
export const createCompany = async (name: string) => {
  const [company] = await db
    .insert(schema.companyTable)
    .values({ id: crypto.randomUUID(), name })
    .returning({ id: schema.companyTable.id });
  return company?.id;
};

// Create salary record with associated company and user
export const createSalary = async (
  userId: string,
  companyName: string,
  amount: number
) => {
  console.log('🔄 Attempting to insert salary...', {
    userId,
    companyName,
    amount,
  });

  try {
    // Check if the company already exists
    const company = await db
      .select()
      .from(schema.companyTable)
      .where(eq(schema.companyTable.name, companyName))
      .limit(1);

    console.log('🏢 Company Lookup Result:', company);
    let companyId = company[0]?.id;

    // Create company if it doesn't exist
    if (!companyId) {
      console.log('⚡ Creating new company:', companyName);
      companyId = await createCompany(companyName);
      console.log('✅ New Company Created with ID:', companyId);
    }

    // Ensure all required fields are present
    if (!companyId || !userId || !amount) {
      console.error('❌ Missing required fields:', {
        companyId,
        userId,
        amount,
      });
      return null;
    }

    // Insert salary record using the provided userId
    // Insert salary record using the provided userId
    const [salary] = await db
      .insert(schema.salaryTable)
      .values({
        id: crypto.randomUUID(),
        amount: amount.toString(),
        company_id: companyId,
        user_id: userId, // Use the parameter here
      })
      .returning({ id: schema.salaryTable.id });

    console.log('✅ Inserted Salary:', salary);
    return salary?.id;
  } catch (error) {
    console.error('🔥 Error inserting salary:', error);
    return null;
  }
};

// Get all salaries with associated company name
export const getSalaries = async () => {
  return await db
    .select({
      id: schema.salaryTable.id,
      amount: schema.salaryTable.amount,
      companyName: schema.companyTable.name,
    })
    .from(schema.salaryTable)
    .innerJoin(
      schema.companyTable,
      eq(schema.salaryTable.company_id, schema.companyTable.id)
    );
};

try {
  const salaries = await getSalaries();
  console.log(
    'Fetched salaries with company name:',
    JSON.stringify(salaries, null, 2)
  );
} catch (error) {
  console.error('Error fetching salaries:', error);
}

// Update a salary record's amount
export const updateSalary = async (salaryId: string, newAmount: number) => {
  return await db
    .update(schema.salaryTable)
    .set({ amount: newAmount.toString() })
    .where(eq(schema.salaryTable.id, salaryId));
};

// Delete a salary record
export const deleteSalary = async (salaryId: string) => {
  return await db
    .delete(schema.salaryTable)
    .where(eq(schema.salaryTable.id, salaryId));
};
