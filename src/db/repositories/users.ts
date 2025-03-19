import { eq } from 'drizzle-orm';
import { db } from '../index';
import * as schema from '../schema';
interface CreateUserInput {
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
}

export const createUser = async (userData: CreateUserInput) => {
  return await db.insert(schema.user).values({
    id: crypto.randomUUID(), // Generate a UUID for the id field
    name: userData.name,
    email: userData.email,
    emailVerified: userData.emailVerified ?? false, // Default to false if not provided
    image: userData.image ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const readUsers = async () => {
  const users = await db
    .select({ user_name: schema.user.name, email: schema.user.email })
    .from(schema.user);

  return users;
};

export const updateUser = async (id: string, name: string) => {
  return await db
    .update(schema.user)
    .set({ name, updatedAt: new Date() })
    .where(eq(schema.user.id, id));
};

export const deleteUser = async (id: string) => {
  return await db.delete(schema.user).where(eq(schema.user.id, id));
};
