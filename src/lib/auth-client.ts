import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000', // Your app's base URL
});

// Export auth functions for easy use
export const { signIn, signOut, useSession } = authClient;
