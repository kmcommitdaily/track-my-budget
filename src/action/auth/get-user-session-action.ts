"use server";
import { createDependencies } from "@/infra/dependencies";

export async function getSessionAction() {
  const deps = createDependencies();
  const session = await deps.authService.getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
