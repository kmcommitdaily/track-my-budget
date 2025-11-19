import { NextResponse } from "next/server";
import { createDependencies } from "@/infra/dependencies";
import {
  getSalariesUseCase,
  createSalaryUseCase,
  deleteSalaryUseCase,
} from "@/core/use-cases";

export async function GET() {
  try {
    const deps = createDependencies();
    const salaries = await getSalariesUseCase({
      salaryRepository: deps.salaryRepository,
      authService: deps.authService,
    });
    return NextResponse.json({ success: true, salaries });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const deps = createDependencies();
    const { companyName, amount } = await req.json();

    if (!companyName?.trim() || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        {
          error: "Invalid input. Company name and a valid amount are required.",
        },
        { status: 400 }
      );
    }

    const salaryId = await createSalaryUseCase(
      {
        salaryRepository: deps.salaryRepository,
        companyRepository: deps.companyRepository,
        authService: deps.authService,
      },
      { companyName, amount }
    );

    return NextResponse.json({ success: true, salaryId });
  } catch (error) {
    console.error("Error creating salary:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: Request) {
  try {
    const deps = createDependencies();
    const { salaryId } = await req.json();

    if (!salaryId) {
      return NextResponse.json({ error: "Missing salaryId" }, { status: 400 });
    }

    const result = await deleteSalaryUseCase(
      {
        salaryRepository: deps.salaryRepository,
        authService: deps.authService,
      },
      salaryId
    );

    return NextResponse.json({ success: result });
  } catch (error) {
    console.error("Error deleting salary:", error);
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
