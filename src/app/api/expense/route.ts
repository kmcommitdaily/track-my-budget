import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import {
  createItemExpenses,
  getItemExpenses,
  deleteItemExpenses,
} from '@/db/repositories/expenses';

import { headers } from 'next/headers';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const itemExpenses = await getItemExpenses(session.user.id);
    return NextResponse.json({ success: true, itemExpenses });
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

    const { itemName, categoryId, price } = await req.json();

    if (
      !itemName?.trim() ||
      !categoryId?.trim() ||
      typeof price !== 'number' ||
      price <= 0
    ) {
      return NextResponse.json(
        { error: 'Invalid input, company name and valid amount required' },
        { status: 400 }
      );
    }

    const itemExpensesId = await createItemExpenses(
      itemName,
      categoryId,
      price,
      session.user.id
    );

    if (!itemExpensesId) {
      throw new Error('Failed to create item expenses');
    }

    return NextResponse.json({ success: true, itemExpensesId });
  } catch (error) {
    console.error('🔥 Error creating itemExpenses:', error);
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

    const { itemExpensesId } = await req.json();

    if (!itemExpensesId) {
      return NextResponse.json(
        { error: 'Missing categoryId' },
        { status: 400 }
      );
    }

    const result = await deleteItemExpenses(itemExpensesId, session.user.id);

    return NextResponse.json({ success: result });
  } catch (error) {
    console.error('🔥 Error deleting items expenses:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
