import type { NextConfig } from "next";
import "./src/config/env";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;