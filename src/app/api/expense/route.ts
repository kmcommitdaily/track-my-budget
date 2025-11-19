import { NextResponse } from "next/server";
import { createDependencies } from "@/infra/dependencies";
import {
  getItemExpensesUseCase,
  createItemExpenseUseCase,
  deleteItemExpenseUseCase,
} from "@/core/use-cases";

export async function GET() {
  try {
    const deps = createDependencies();
    const itemExpenses = await getItemExpensesUseCase({
      expenseRepository: deps.expenseRepository,
      authService: deps.authService,
    });
    return NextResponse.json({ success: true, itemExpenses });
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
    const { itemName, categoryId, price } = await req.json();

    if (
      !itemName?.trim() ||
      !categoryId?.trim() ||
      typeof price !== "number" ||
      price <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid input, item name, category ID and valid price required",
        },
        { status: 400 }
      );
    }

    const itemExpensesId = await createItemExpenseUseCase(
      {
        expenseRepository: deps.expenseRepository,
        budgetRepository: deps.budgetRepository,
        authService: deps.authService,
      },
      { itemName, categoryId, price }
    );

    return NextResponse.json({ success: true, itemExpensesId });
  } catch (error) {
    console.error("Error creating item expense:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: Request) {
  try {
    const deps = createDependencies();
    const { itemExpensesId } = await req.json();

    if (!itemExpensesId) {
      return NextResponse.json(
        { error: "Missing itemExpensesId" },
        { status: 400 }
      );
    }

    const result = await deleteItemExpenseUseCase(
      {
        expenseRepository: deps.expenseRepository,
        authService: deps.authService,
      },
      itemExpensesId
    );

    return NextResponse.json({ success: result });
  } catch (error) {
    console.error("Error deleting item expense:", error);
    const message = error instanceof Error ? error.message : "Internal error";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
