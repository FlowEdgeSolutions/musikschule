import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

function normalizeBasePath(input) {
  const trimmed = String(input ?? "").trim();
  if (!trimmed || trimmed === "/") return "";

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash.slice(0, -1) : withLeadingSlash;
}

async function copyDirContents(srcDir, destDir) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  await fs.mkdir(destDir, { recursive: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirContents(srcPath, destPath);
      continue;
    }

    if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
      continue;
    }

    // Ignore symlinks/sockets/etc. (shouldn't exist in Next export output).
  }
}

function run(cmd, args, env) {
  const isWin = process.platform === "win32";
  const res = spawnSync(cmd, args, {
    stdio: "inherit",
    env,
    // Required on Windows to run .cmd shims like "npm".
    shell: isWin,
  });
  if (res.error) {
    console.error(`[pages] Failed to run "${cmd} ${args.join(" ")}":`, res.error);
  }
  if (res.status !== 0) process.exit(res.status ?? 1);
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? "/musikschule");

const env = {
  ...process.env,
  NEXT_PUBLIC_BASE_PATH: basePath,
};

console.log(`[pages] next build (Static Export) with NEXT_PUBLIC_BASE_PATH=${basePath || "(empty)"}`);
run("npm", ["run", "build"], env);

const outDir = path.join(process.cwd(), "out");
const docsDir = path.join(process.cwd(), "docs");

console.log(`[pages] Copying ${outDir} -> ${docsDir}`);
await fs.rm(docsDir, { recursive: true, force: true });
await fs.mkdir(docsDir, { recursive: true });
await copyDirContents(outDir, docsDir);

// Ensure Jekyll is disabled so "_next/" is served on GitHub Pages.
const nojekyllPath = path.join(docsDir, ".nojekyll");
try {
  await fs.access(nojekyllPath);
} catch {
  await fs.writeFile(nojekyllPath, "");
}

console.log("[pages] Done. Next step: commit and push the docs/ folder, then set Pages source to main /docs.");
