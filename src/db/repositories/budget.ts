import { eq } from 'drizzle-orm';
import { db } from '../index';
import * as schema from '../schema';
import { createCategory } from './category';

const getTimestamps = () => ({
  created_at: new Date(),
  updated_at: new Date(),
});

export const getBudget = async (userId: string) => {
  if (!userId) {
    throw new Error('user id is required for budget');
  }

  const budget = await db
    .select({
      id: schema.budgetTable.id,
      amount: schema.budgetTable.amount,
      categoryTitle: schema.categoriesTable.title,
    })
    .from(schema.budgetTable)
    .innerJoin(
      schema.categoriesTable,
      eq(schema.categoriesTable.id, schema.budgetTable.category_id)
    );
  return budget;
};

export const createBudget = async (
  amount: number,
  categoryTitle: string,
  userId: string
): Promise<string | null> => {
  try {
    if (!userId || !categoryTitle?.trim() || amount <= 0) {
      console.error('Invalid input:', { userId, amount, categoryTitle });
      throw new Error('All fields must be valid');
    }

    let categoryId: string | null;

    const existingCategory = await db
      .select()
      .from(schema.categoriesTable)
      .where(eq(schema.categoriesTable.title, categoryTitle));

    if (existingCategory.length > 0) {
      console.log(
        `Category "${categoryTitle}" alrady exist with ID ${existingCategory[0].id}`
      );
      categoryId = existingCategory[0].id;
    } else {
      categoryId = await createCategory(categoryTitle);
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
      })
      .returning({ id: schema.budgetTable.id });

    return budget.id;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteBudget = async (
  budgetId: string,
  categoryId: string
): Promise<boolean> => {
  if (!budgetId || !categoryId) throw new Error('Missing IDs');

  await db.transaction(async (tx) => {
    const [existingBudget] = await tx
      .select()
      .from(schema.budgetTable)
      .where(eq(schema.budgetTable.id, budgetId));

    if (!existingBudget) throw new Error('Budget not found');

    await tx
      .delete(schema.budgetTable)
      .where(eq(schema.budgetTable.id, budgetId));

    const otherBudgets = await tx
      .select()
      .from(schema.budgetTable)
      .where(eq(schema.budgetTable.category_id, categoryId));

    if (otherBudgets.length === 0) {
      await tx
        .delete(schema.categoriesTable)
        .where(eq(schema.categoriesTable.id, categoryId));
    }
  });

  return true;
};

