/**
 * Auth Service Port
 * Interface for authentication operations
 */

export type UserSession = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
  };
};

export type AuthService = {
  getSession: () => Promise<UserSession | null>;
};
