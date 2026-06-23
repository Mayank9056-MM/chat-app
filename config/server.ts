// config/server.ts

import {z} from "zod";

const envSchema = z.object({

    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),

    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    OPENROUTER_API_KEY: z.string().min(1),
    
    // NEXT_PUBLIC_APP_URL: z.string().min(1),
})

const safeConfig = envSchema.safeParse(process.env);

if(!safeConfig.success){
    console.error(z.treeifyError(safeConfig.error));
    throw new Error("Invalid environment variables");
}

export const config = safeConfig.data;