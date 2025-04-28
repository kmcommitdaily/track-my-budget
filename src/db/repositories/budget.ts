import { eq } from 'drizzle-orm';
import { db } from '../index';
import * as schema from '../schema';
import { createCategory } from './category';
import { sql } from 'drizzle-orm';

const getTimestamps = () => ({
  created_at: new Date(),
  updated_at: new Date(),
});
const getCurrentMonth = () => {
  const date = new Date();
  return date.toISOString().slice(0, 7); // Format: YYYY-MM
};
export const getBudget = async (userId: string) => {
  if (!userId) {
    throw new Error('user id is required for budget');
  }

  const budget = await db
    .select({
      id: schema.budgetTable.id,
      amount: schema.budgetTable.amount,
      categoryTitle: schema.categoriesTable.title,
      categoryId: schema.budgetTable.category_id,
      remainingAmount: sql`
        ${schema.budgetTable.amount} - COALESCE((
          SELECT SUM(${schema.itemsTable.price})
          FROM ${schema.itemsTable}
          WHERE ${schema.itemsTable.budget_id} = ${schema.budgetTable.id}
        ), 0)
      `.as('remaining_amount'),
      month: schema.budgetTable.month,
    })
    .from(schema.budgetTable)
    .innerJoin(
      schema.categoriesTable,
      eq(schema.categoriesTable.id, schema.budgetTable.category_id)
    )
    .where(eq(schema.budgetTable.user_id, userId));

  return budget;
};

export const createBudget = async (
  amount: number,
  categoryTitle: string,
  userId: string,
  month: string = getCurrentMonth()
): Promise<string | null> => {
  try {
    if (!userId || !categoryTitle?.trim() || amount <= 0 || !month) {
      console.error('Invalid input:', { userId, amount, categoryTitle, month });
      throw new Error('All fields must be valid');
    }

    let categoryId: string | null;

    const existingCategory = await db
      .select()
      .from(schema.categoriesTable)
      .where(eq(schema.categoriesTable.title, categoryTitle));

    if (existingCategory.length > 0) {
    
      categoryId = existingCategory[0].id;
    } else {
      categoryId = await createCategory(categoryTitle, userId);
    }

    if (!categoryId) {
      throw new Error('failed to create or category');
    }
    const [budget] = await db
      .insert(schema.budgetTable)
      .values({
        id: crypto.randomUUID(),
        amount: amount.toString(),
        category_id: categoryId,
        user_id: userId,
        ...getTimestamps(),
        month: month
      })
      .returning({ id: schema.budgetTable.id });

    return budget.id;
  } catch (error) {
    console.error(error);
    return null;
  }
};
