import {z} from "zod";

const envSchema = z.object({
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string()
})

const safeConfig = envSchema.safeParse(process.env);

if(!safeConfig.success){
    console.error(z.treeifyError(safeConfig.error));
    throw new Error("Invalid environment variables");
}

export const config = safeConfig.data;