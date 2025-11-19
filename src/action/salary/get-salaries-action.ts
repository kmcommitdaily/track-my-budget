"use server";
import { createDependencies } from "@/infra/dependencies";
import { getSalariesUseCase } from "@/core/use-cases";

/**
 * Server Action to fetch salaries/income data.
 * This runs on the server and can be safely called from client components via React Query.
 */
export async function getSalariesAction() {
  try {
    const deps = createDependencies();
    const salaries = await getSalariesUseCase({
      salaryRepository: deps.salaryRepository,
      authService: deps.authService,
    });
    return salaries;
  } catch (error) {
    console.error("Failed to fetch salaries", error);
    throw error;
  }
}
