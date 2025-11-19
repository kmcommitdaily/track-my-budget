import { NextResponse } from "next/server";
import { createDependencies } from "@/infra/dependencies";

export async function GET() {
  try {
    const deps = createDependencies();
    const session = await deps.authService.getSession();

    if (!session) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: session.user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ user: null });
  }
}
