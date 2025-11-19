/**
 * Category Repository Implementation
 * Implements CategoryRepository port using Drizzle ORM
 */

import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import type { CategoryRepository } from "@/core/ports/category-repository";
import type { Category } from "@/core/entities/category";
import {
  mapCategoryToEntity,
  mapCategoryToDb,
} from "../mappers/category-mapper";

/**
 * Creates a category repository instance
 */
export function createCategoryRepository(): CategoryRepository {
  return {
    findById: async (id: string): Promise<Category | null> => {
      const [row] = await db
        .select()
        .from(schema.categoriesTable)
        .where(eq(schema.categoriesTable.id, id))
        .limit(1);

      return row ? mapCategoryToEntity(row) : null;
    },

    findByTitle: async (
      title: string,
      userId: string
    ): Promise<Category | null> => {
      const [row] = await db
        .select()
        .from(schema.categoriesTable)
        .where(eq(schema.categoriesTable.title, title))
        .limit(1);

      if (!row || row.user_id !== userId) {
        return null;
      }

      return mapCategoryToEntity(row);
    },

    findByUserId: async (userId: string): Promise<Category[]> => {
      const rows = await db
        .select()
        .from(schema.categoriesTable)
        .where(eq(schema.categoriesTable.user_id, userId));

      return rows.map(mapCategoryToEntity);
    },

    create: async (category: Category): Promise<Category> => {
      const [row] = await db
        .insert(schema.categoriesTable)
        .values(mapCategoryToDb(category))
        .returning();

      if (!row) {
        throw new Error("Failed to create category");
      }

      return mapCategoryToEntity(row);
    },

    delete: async (id: string, userId: string): Promise<boolean> => {
      // Use returning() to check if any rows were actually deleted
      // This allows us to distinguish between "not found" and "unauthorized"
      const result = await db
        .delete(schema.categoriesTable)
        .where(
          and(
            eq(schema.categoriesTable.id, id),
            eq(schema.categoriesTable.user_id, userId)
          )
        )
        .returning({ id: schema.categoriesTable.id });

      // Return true only if a row was actually deleted
      return result.length > 0;
    },
  };
}
