/**
 * Auth Service Implementation
 * Concrete implementation of auth service port using Better Auth
 */

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { AuthService, UserSession } from "@/core/ports/auth-service";

/**
 * Creates an auth service instance
 */
export function createAuthService(): AuthService {
  return {
    getSession: async (): Promise<UserSession | null> => {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session) {
        return null;
      }
      return {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          emailVerified: session.user.emailVerified,
          image: session.user.image,
        },
      };
    },
  };
}
