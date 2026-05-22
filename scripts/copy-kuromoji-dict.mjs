import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "node_modules", "kuromoji", "dict");
const target = join(root, "public", "kuromoji-dict");

if (!existsSync(source)) {
  console.warn("[copy-kuromoji-dict] kuromoji dict not found, skip");
  process.exit(0);
}

if (existsSync(target)) {
  rmSync(target, { recursive: true, force: true });
}

mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });
console.log("[copy-kuromoji-dict] copied to public/kuromoji-dict");
