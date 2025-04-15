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
      className="px-4 py-2 bg-blue-50 text-gray-500 hover:text-white hover:bg-red-400 rounded ml-auto">
      Sign out
    </button>
  );
};
