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
  NEON_AUTH_BASE_URL: z.string().url().optional(),
  NEON_AUTH_COOKIE_SECRET: z.string().min(32).optional(),

  // Email
  GMAIL_CLIENT_ID: z.string().optional(),
  GMAIL_CLIENT_SECRET: z.string().optional(),
  GMAIL_REFRESH_TOKEN: z.string().optional(),
  GMAIL_SENDER: z.string().optional(),
  CONTACT_EMAIL: z.string().email().optional(),

  // CORS
  CORS_ORIGIN: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),

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