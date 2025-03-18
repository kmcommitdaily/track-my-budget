'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export const SignOutButton = () => {
  const router = useRouter();
  const handleSignout = async () => {
    try {
      await authClient.signOut();
      router.push('./');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    console.log('Signing out');
  };
  return (
    <Button className="ml-auto mr-4" onClick={handleSignout}>
      Signout
    </Button>
  );
};
