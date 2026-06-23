
import { createAuthClient } from "better-auth/react";
import { clientConfig } from "@/config/client";

export const authClient = createAuthClient({
  baseURL: clientConfig.NEXT_PUBLIC_APP_URL,
});
