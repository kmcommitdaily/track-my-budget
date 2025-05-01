import { db } from '@/db'; // adjust if needed
import {
  user,
  categoriesTable,
  budgetTable,
  itemsTable,
} from '../src/db/schema';
import { InferInsertModel } from 'drizzle-orm';
import { randomUUID } from 'crypto';

type UserInsert = InferInsertModel<typeof user>;
type CategoryInsert = InferInsertModel<typeof categoriesTable>;
type BudgetInsert = InferInsertModel<typeof budgetTable>;
type ItemInsert = InferInsertModel<typeof itemsTable>;

const userId = 'user-seed';
const categoryId = randomUUID();
const budgetId = randomUUID();
const itemId = randomUUID();

async function seed() {
  console.log('🌱 Starting seeding process...');

  // Create user (safe insert)
  const userData: UserInsert = {
    id: userId,
    name: 'Seeder User',
    email: 'seed@example.com',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.insert(user).values(userData).onConflictDoNothing();

  // Create category
  const categoryData: CategoryInsert = {
    id: categoryId,
    title: 'Seeder Category',
    user_id: userId,
    created_at: new Date(),
    updated_at: new Date(),
    month: new Date().toISOString().slice(0, 7), // Format: YYYY-MM
  };

  await db.insert(categoriesTable).values(categoryData).onConflictDoNothing();

  // Create budget
  const budgetData: BudgetInsert = {
    id: budgetId,
    amount: '5000',
    remaining_amount: '5000',
    user_id: userId,
    category_id: categoryId,
    start_date: new Date(),
    end_date: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    month: new Date().toISOString().slice(0, 7), // Format: YYYY-MM
  };

  await db.insert(budgetTable).values(budgetData).onConflictDoNothing();

  // Create item
  const itemData: ItemInsert = {
    id: itemId,
    name: 'Seeded Item',
    price: '100',
    quantity: '1',
    user_id: userId,
    category_id: categoryId,
    budget_id: budgetId,
    created_at: new Date(),
    updated_at: new Date(),
    month: new Date().toISOString().slice(0, 7), // Format: YYYY-MM
  };

  await db.insert(itemsTable).values(itemData).onConflictDoNothing();


}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
});
