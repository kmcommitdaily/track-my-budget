// import { deleteSalary } from '@/db/repositories/finance';
// import { NextResponse } from 'next/server';

// export async function DELETE(req: Request) {
//   try {
//     const { salaryId } = await req.json();

//     if (!salaryId) {
//       return NextResponse.json(
//         { error: 'Salary ID is required' },
//         { status: 400 }
//       );
//     }

//     await deleteSalary(salaryId);

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('🔥 Error deleting salary:', error);
//     return NextResponse.json(
//       { error: 'Failed to delete salary' },
//       { status: 500 }
//     );
//   }
// }
