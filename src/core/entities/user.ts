/**
 * User Entity
 * Pure business logic for user domain model
 */

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Creates a new user entity
 */
export function createUser(
  name: string,
  email: string,
  emailVerified: boolean = false,
  image?: string | null
): User {
  if (!name?.trim()) {
    throw new Error("User name is required");
  }
  if (!email?.trim()) {
    throw new Error("User email is required");
  }
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    emailVerified,
    image: image || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates user data
 */
export function validateUser(user: Partial<User>): boolean {
  return !!(
    user.name?.trim() &&
    user.email?.trim() &&
    isValidEmail(user.email)
  );
}
