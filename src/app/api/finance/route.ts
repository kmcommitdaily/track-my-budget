import { NextResponse } from 'next/server';
import { createSalary, getSalaries } from '../../../db/repositories/finance';

const TEMP_USER_ID = '3e13d656-8e7f-4c94-b1dc-08cd98ef3c14';

// GET - Fetch all salaries
export async function GET() {
  try {
    const salaries = await getSalaries();
    return NextResponse.json(salaries);
  } catch (error) {
    console.error('Error fetching salaries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch salaries' },
      { status: 500 }
    );
  }
}

// POST - Add a new salary (with company info)
export async function POST(req: Request) {
  try {
    // Expecting a JSON with companyName and amount
    const { companyName, amount } = await req.json();
    await createSalary(TEMP_USER_ID, companyName, amount);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding salary:', error);
    return NextResponse.json(
      { error: 'Failed to add salary' },
      { status: 500 }
    );
  }
}

// const salaries = await getSalaries();
// console.log('Raw salaries:', JSON.stringify(salaries, null, 2));
