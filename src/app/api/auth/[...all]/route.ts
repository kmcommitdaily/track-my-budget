import { auth } from "@/lib/auth"; // Import the auth instance
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
