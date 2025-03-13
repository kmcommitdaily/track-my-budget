import { eq } from 'drizzle-orm';
import { db } from '../index';
import * as schema from '../schema';

export const createUser = async () => {
  await db.insert(schema.usersTable).values({
    id: crypto.randomUUID(), // Generate a UUID for the id field
    name: 'Johjn DOe',
    email: 'asdsad@gmail.com',
    password: 'asdasd',
  });
};

export const readUsers = async () => {
  const users = await db
    .select({ user_name: schema.usersTable.name })
    .from(schema.usersTable);

  return users;
};

export const updateUser = async (id: string, name: string) => {
  return await db
    .update(schema.usersTable)
    .set({ name })
    .where(eq(schema.usersTable.id, id));
};

export const deleteUser = async (id: string) => {
  return await db.delete(schema.usersTable).where(eq(schema.usersTable.id, id));
};
