import { config } from "@/config/config";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: config.NEXT_PUBLIC_APP_URL,
});
