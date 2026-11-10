import path from "node:path";
import { config } from "dotenv";

const envFile = path.resolve(process.cwd(), ".env.testing");
const { error } = config({ path: envFile });

if (error) {
  throw error;
}

await import("next/dist/bin/next");
