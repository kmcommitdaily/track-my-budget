import { NextResponse } from "next/server";
import { createDependencies } from "@/infra/dependencies";
import {
  getCategoryWithBudget,
  createBudgetUseCase,
  deleteCategoryUseCase,
} from "@/core/use-cases";

export async function GET() {
  try {
    const deps = createDependencies();
    const budget = await getCategoryWithBudget({
      budgetRepository: deps.budgetRepository,
      authService: deps.authService,
    });
    return NextResponse.json({ success: true, budget });
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
    const { categoryTitle, amount } = await req.json();

    if (!categoryTitle?.trim() || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid input, category title and valid amount required" },
        { status: 400 }
      );
    }

    const budgetId = await createBudgetUseCase(
      {
        budgetRepository: deps.budgetRepository,
        categoryRepository: deps.categoryRepository,
        authService: deps.authService,
      },
      { categoryTitle, amount }
    );

    return NextResponse.json({ success: true, budgetId });
  } catch (error) {
    console.error("Error creating budget:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: Request) {
  try {
    const deps = createDependencies();
    const { categoryId } = await req.json();

    if (!categoryId) {
      return NextResponse.json(
        { error: "Missing categoryId" },
        { status: 400 }
      );
    }

    const result = await deleteCategoryUseCase(
      {
        categoryRepository: deps.categoryRepository,
        authService: deps.authService,
      },
      categoryId
    );

    return NextResponse.json({ success: result });
  } catch (error) {
    console.error("Error deleting category:", error);
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
