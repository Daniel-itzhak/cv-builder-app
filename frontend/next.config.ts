import path from "path";
import type { NextConfig } from "next";

const frontendRoot = path.resolve(process.cwd());

const nextConfig: NextConfig = {
  // Prevent Turbopack from using a stray lockfile in the home directory
  // as the workspace root (that made every route 404).
  outputFileTracingRoot: frontendRoot,
  turbopack: {
    root: frontendRoot,
  },
};

export default nextConfig;
