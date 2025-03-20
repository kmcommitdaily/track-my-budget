import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { createSalary, getSalaries } from '@/db/repositories/finance'; // Ensure correct path
import { headers } from 'next/headers';

// 🔹 Handle GET request to fetch salaries
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('📌 Fetching salaries for user:', session.user.id);

    // 🔹 Retrieve salaries from the database
    const salaries = await getSalaries(session.user.id);
    return NextResponse.json({ success: true, salaries });
  } catch (error) {
    console.error('🔥 Error fetching salaries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // 🔹 Retrieve the session from Better Auth
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 🔹 Parse request body
    const { companyName, amount } = await req.json();
    console.log('📌 Creating salary for user:', session.user.id);

    // 🔹 Validate input
    if (!companyName?.trim() || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        {
          error: 'Invalid input. Company name and a valid amount are required.',
        },
        { status: 400 }
      );
    }

    // 🔹 Call the createSalary function
    const salaryId = await createSalary(session.user.id, companyName, amount);

    if (!salaryId) {
      throw new Error('Failed to create salary.');
    }

    console.log(`✅ Salary created successfully! ID: ${salaryId}`);
    return NextResponse.json({ success: true, salaryId });
  } catch (error) {
    console.error('🔥 Error creating salary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
