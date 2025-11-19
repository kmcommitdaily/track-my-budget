/**
 * Category Entity
 * Pure business logic for category domain model
 */

export type Category = {
  id: string;
  title: string;
  userId: string;
  month: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Creates a new category entity
 */
export function createCategory(
  title: string,
  userId: string,
  month: string
): Category {
  if (!title?.trim()) {
    throw new Error("Category title is required");
  }
  if (!userId?.trim()) {
    throw new Error("User ID is required");
  }
  if (!month?.trim()) {
    throw new Error("Month is required");
  }

  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    userId,
    month,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Validates category data
 */
export function validateCategory(category: Partial<Category>): boolean {
  return !!(
    category.title?.trim() &&
    category.userId?.trim() &&
    category.month?.trim()
  );
}
