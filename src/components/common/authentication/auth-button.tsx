'use client';
import { authClient, signOut, useSession } from '@/lib/auth-client';

export default function AuthButton() {
  const { data: session } = useSession();

  return session ? (
    <button onClick={() => signOut()}>Logout</button>
  ) : (
    <button onClick={() => authClient.signIn.social({ provider: 'google' })}>
      Login
    </button>
  );
}
