import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { createBudget, getBudget } from '@/db/repositories/budget';
import { deleteCategory } from '@/db/repositories/category';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const budget = await getBudget(session.user.id);
    return NextResponse.json({ success: true, budget });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (typeof session.user.id !== 'string') {
      throw new Error('Invalid session: user ID must be a string.');
    }
    const { categoryTitle, amount } = await req.json();

    if (!categoryTitle?.trim() || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid input, company name and valid amount required' },
        { status: 400 }
      );
    }

    const budgetId = await createBudget(amount, categoryTitle, session.user.id);

    if (!budgetId) {
      throw new Error('Failedd to create budget');
    }

    return NextResponse.json({ success: true, budgetId });
  } catch (error) {
    console.error('🔥 Error creating budget:', error);
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
      return NextResponse.json({ Error: 'Unauthorized' }, { status: 401 });
    }

    const { categoryId } = await req.json();

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Missing categoryId' },
        { status: 400 }
      );
    }

    const result = await deleteCategory(categoryId, session.user.id);

    return NextResponse.json({ success: result });
  } catch (error) {
    console.error('🔥 Error deleting category:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
