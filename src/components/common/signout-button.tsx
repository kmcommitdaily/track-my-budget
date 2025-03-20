'use client';

import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client'; // Adjust this import to your actual auth client

export const SignoutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('./'); // Redirect to login page
          },
        },
      });
    } catch (error) {
      console.error('Signout failed:', error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 bg-red-500 text-white rounded ml-auto">
      Sign out
    </button>
  );
};
