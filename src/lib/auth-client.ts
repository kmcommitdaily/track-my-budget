import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL!,
  // Your app's base URL
});

// Export auth functions for easy use
export const { signIn, signOut, useSession } = authClient;
