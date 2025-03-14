'use client';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AuthButton from '../../components/common/authentication/auth-button';

export default function HomePage() {
  const { data: session, isPending } = useSession(); // ✅ Corrected structure
  const router = useRouter();

  useEffect(() => {
    if (!session && !isPending) {
      router.push('/login'); // ✅ Redirect if session is null and not loading
    }
  }, [session, isPending, router]);

  if (isPending) return <p>Loading...</p>; // ✅ Show loading while fetching session data

  return (
    <div>
      <h1>Welcome, {session?.user?.email}!</h1>
      <AuthButton />
    </div>
  );
}
