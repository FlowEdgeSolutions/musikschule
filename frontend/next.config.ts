import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Erzeugt .next/standalone mit eigenem Server — Basis für das Docker-Image.
  output: "standalone",
  // Nicht mitbündeln, sondern nach standalone/node_modules kopieren:
  // scripts/migrate.mjs braucht beide Pakete zur Laufzeit im Container.
  serverExternalPackages: ["drizzle-orm", "postgres"],
};

export default nextConfig;
