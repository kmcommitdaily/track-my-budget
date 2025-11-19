/**
 * Category Mapper
 * Maps between database models and domain entities
 */

import type { Category } from "@/core/entities/category";
import * as schema from "@/db/schema";

type CategoryRow = {
  id: string;
  title: string | null;
  user_id: string;
  month: string;
  created_at: Date | null;
  updated_at: Date | null;
};

/**
 * Maps database row to domain entity
 */
export function mapCategoryToEntity(row: CategoryRow): Category {
  return {
    id: row.id,
    title: row.title || "",
    userId: row.user_id,
    month: row.month,
    createdAt: row.created_at || new Date(),
    updatedAt: row.updated_at || new Date(),
  };
}

/**
 * Maps domain entity to database insert values
 */
export function mapCategoryToDb(entity: Category) {
  return {
    id: entity.id,
    title: entity.title,
    user_id: entity.userId,
    month: entity.month,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
}
