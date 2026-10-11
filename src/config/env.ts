import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envSchema = z.object({
  // Backend services — optional for frontend-only deployment
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),

  // Authentication
  BETTER_AUTH_SECRET: z.string().optional(),
  SESSION_SECRET: z.string().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),

  // OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // CORS
  CORS_ORIGIN: z.string().optional(),

  // Runtime
  PORT: z.preprocess(
    (val) => val ?? "3000",
    z.coerce.number().int().positive()
  ),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;