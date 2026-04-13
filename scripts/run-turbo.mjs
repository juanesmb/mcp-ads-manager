#!/usr/bin/env node
/**
 * Turbo looks up the package manager binary on PATH. When only Corepack is used,
 * `pnpm` may be missing here. Prepend local node_modules/.bin (includes `pnpm` devDep).
 */
import { spawnSync } from "node:child_process";
import { delimiter, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const localBin = join(root, "node_modules", ".bin");
process.env.PATH = `${localBin}${delimiter}${process.env.PATH}`;

const turboBin = join(localBin, process.platform === "win32" ? "turbo.cmd" : "turbo");
const result = spawnSync(turboBin, process.argv.slice(2), {
  stdio: "inherit",
  env: process.env,
  cwd: root
});

process.exit(result.status ?? 1);
