import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
);

console.info(`[next.config] turbopack.root set to ${workspaceRoot}`);

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: workspaceRoot,
  },
};

export default nextConfig;
