import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

// 1. Manually load environment variables during next.config lifecycle
// This reads the .env files before Zod starts parsing
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),

  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  SESSION_SECRET: z.string().min(1, "SESSION_SECRET is required"),

  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN is required"),
  
  // Provide a safe fallback for PORT if it's evaluated as undefined before parse
  PORT: z.preprocess(
    (val) => val ?? "3000", 
    z.coerce.number().int().positive()
  ),
  
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
