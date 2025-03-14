'use client';
import { authClient } from '@/lib/auth-client';

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    try {
      const data = await authClient.signIn.social({ provider: 'google' });
      console.log('Google Sign-In Response:', data);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  );
}
