import { eq } from 'drizzle-orm';
import { db } from '../index';
import * as schema from '../schema';


const getCurrentMonth = () => {
  const date = new Date();
  return date.toISOString().slice(0, 7); // Format: YYYY-MM
};
export const getCategory = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('user is require');
    }

    const category = await db
      .select({
        id: schema.categoriesTable.id,
        categoryTitle: schema.categoriesTable.title,
        month: schema.categoriesTable.month,
      })
      .from(schema.categoriesTable);

    return category;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createCategory = async (
  categoryTitle: string,
  userId: string,
  month: string = getCurrentMonth()
): Promise<string | null> => {
  try {
    if (!categoryTitle?.trim() || !userId || !month) {
      throw new Error('user id , month and category title are required nad must be valid');
    }

    const existingCategory = await db
      .select()
      .from(schema.categoriesTable)
      .where(eq(schema.categoriesTable.title, categoryTitle));

    if (existingCategory.length > 0) {
      console.log(
        `Category "${categoryTitle}" alrady exist with ID ${existingCategory[0].id}`
      );
      return existingCategory[0].id;
    }

    const [newCategory] = await db
      .insert(schema.categoriesTable)
      .values({
        id: crypto.randomUUID(),
        title: categoryTitle,
        user_id: userId,
        month: month
      })
      .returning({ id: schema.categoriesTable.id });

    if (!newCategory?.id) {
      throw new Error('Failed to create company');
    }

    return newCategory.id;
  } catch (error) {
    console.error('error creating category', error);
    return null;
  }
};

export const deleteCategory = async (
  categoryId: string,
  userId: string
): Promise<boolean> => {
  if (!categoryId || !userId) {
    throw new Error('Missing categoryId or userId');
  }

  console.log(
    '💥 Attempting to delete category:',
    categoryId,
    'for user:',
    userId
  );

  const [existingCategory] = await db
    .select()
    .from(schema.categoriesTable)
    .where(eq(schema.categoriesTable.id, categoryId));

  if (!existingCategory) throw new Error('Category not found');
  if (existingCategory.user_id !== userId) {
    throw new Error('Unauthorized: category does not belong to user');
  }

  await db
    .delete(schema.categoriesTable)
    .where(eq(schema.categoriesTable.id, categoryId));

  return true;
};
