/**
 * Category Repository Port
 * Interface for category data access operations
 */

import type { Category } from "../entities/category";

export type CategoryRepository = {
  findById: (id: string) => Promise<Category | null>;
  findByTitle: (title: string, userId: string) => Promise<Category | null>;
  findByUserId: (userId: string) => Promise<Category[]>;
  create: (category: Category) => Promise<Category>;
  delete: (id: string, userId: string) => Promise<boolean>;
};
