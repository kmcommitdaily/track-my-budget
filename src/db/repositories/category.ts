import { eq } from 'drizzle-orm';
import { db } from '../index';
import * as schema from '../schema';


export const getCategory = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('user is require');
    }

    const category = await db
      .select({
        id: schema.categoriesTable.id,
        categoryTitle: schema.categoriesTable.title,
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
  userId: string
): Promise<string | null> => {
  try {
    if (!categoryTitle?.trim()) {
      throw new Error('Category title cannot be empty');
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
      .values({ id: crypto.randomUUID(), title: categoryTitle,  user_id: userId,   })
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
