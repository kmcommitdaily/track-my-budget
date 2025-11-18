import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import {
  createSalary,
  getSalaries,
  deleteSalary,
} from '@/db/repositories/finance'; // Ensure correct path
import { headers } from 'next/headers';

// 🔹 Handle GET request to fetch salaries
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 🔹 Retrieve salaries from the database
    const salaries = await getSalaries(session.user.id, month);
    return NextResponse.json({ success: true, salaries });
  } catch {
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
    const salaryId = await createSalary(session.user.id, companyName, amount, month);

    if (!salaryId) {
      throw new Error('Failed to create salary.');
    }

    return NextResponse.json({ success: true, salaryId });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { salaryId } = await req.json();

    if (!salaryId) {
      return NextResponse.json({ error: 'Missing salaryId' }, { status: 400 });
    }

    const result = await deleteSalary(salaryId, session.user.id);

    return NextResponse.json({ success: result });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
