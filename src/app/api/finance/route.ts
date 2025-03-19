import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { createSalary } from '../../../db/repositories/finance';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  // Retrieve the session from Better Auth on the server side.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Now, get the salary data from the request body.
  const { companyName, amount } = await req.json();
  console.log('Creating salary for user:', session.user.id);

  // Use the user ID from the session instead of expecting it from the client.
  const salaryId = await createSalary(session.user.id, companyName, amount);
  return NextResponse.json({ success: true, salaryId });
}
