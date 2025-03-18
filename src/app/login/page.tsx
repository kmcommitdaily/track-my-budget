'use client';
import { authClient } from '@/lib/auth-client';

export default function LoginPage() {
  const handleGoogleSignIn = async () => {
    try {
      const data = await authClient.signIn.social({
        provider: 'google',
      });

      console.log('Google login response:', data);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
    console.log('Logging in with Google');
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  );
}
