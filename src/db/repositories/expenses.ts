import { db } from '../index';
import * as schema from '../schema';
import { eq, and } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

const getTimestamps = () => ({
  created_at: new Date(),
  updated_at: new Date(),
});

export const getItemExpenses = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('user id is required for item expenses');
    }

    const itemExpenses = await db
      .select({
        id: schema.itemsTable.id,
        itemName: schema.itemsTable.name,
        price: schema.itemsTable.price,
        categoryId: schema.itemsTable.category_id,
        createdAt: schema.itemsTable.created_at,
        budgetId: schema.itemsTable.budget_id,
        budgetAmount: schema.budgetTable.amount,
        remainingBudget: sql`
        ${schema.budgetTable.amount} - COALESCE((
          SELECT SUM(${schema.itemsTable.price})
          FROM ${schema.itemsTable}
          WHERE ${schema.itemsTable.budget_id} = ${schema.budgetTable.id}
        ), 0)`.as('remainingBudget'),
        categoryTitle: schema.categoriesTable.title, // 👈 grab it from join
      })
      .from(schema.itemsTable)
      .innerJoin(
        schema.budgetTable,
        eq(schema.itemsTable.budget_id, schema.budgetTable.id)
      )
      .innerJoin(
        schema.categoriesTable,
        eq(schema.itemsTable.category_id, schema.categoriesTable.id)
      ) // 👈 join here
      .where(eq(schema.itemsTable.user_id, userId));

    return itemExpenses;
  } catch (error) {
    console.error('🔥 getItemExpenses error:', error);
    return null;
  }
};

export const createItemExpenses = async (
  itemName: string,
  categoryId: string,
  price: number,
  userId: string
): Promise<string | null> => {
  try {
    if (!itemName?.trim() || !categoryId?.trim() || price <= 0) {
      throw new Error('All fields must be valid');
    }

    const existingBudget = await db
      .select()
      .from(schema.budgetTable)
      .where(eq(schema.budgetTable.category_id, categoryId));
    console.log('[🔍 Budget Lookup]', categoryId, existingBudget);

    if (!existingBudget.length) {
      throw new Error('no budget found in this category');
    }
    const [itemExpenses] = await db
      .insert(schema.itemsTable)
      .values({
        id: crypto.randomUUID(),
        name: itemName,
        price: price.toFixed(2),
        category_id: categoryId,
        budget_id: existingBudget[0].id,
        user_id: userId,
        ...getTimestamps(),
      })
      .returning({ id: schema.itemsTable.id });

    return itemExpenses.id;
  } catch (error) {
    console.error('Error creating item expenses', error);
    return null;
  }
};

export const deleteItemExpenses = async (
  itemExpensesId: string,
  userId: string
) => {
  if (!itemExpensesId?.trim() || !userId?.trim()) {
    throw new Error('Item expenses id and user id are required');
  }

  const [existingItemExpenses] = await db
    .select()
    .from(schema.itemsTable)
    .where(
      and(
        eq(schema.itemsTable.id, itemExpensesId),
        eq(schema.itemsTable.user_id, userId)
      )
    );

  if (!existingItemExpenses) {
    throw new Error('Item expenses not found');
  }

  if (existingItemExpenses.user_id !== userId) {
    throw new Error('Item expenses does not belong to user');
  }

  await db
    .delete(schema.itemsTable)
    .where(eq(schema.itemsTable.id, itemExpensesId));

  return true;
};
