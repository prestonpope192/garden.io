import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const websiteRoot = process.cwd();
const repoRoot = path.resolve(websiteRoot, "..");
const tracked = execFileSync("git", ["-C", repoRoot, "ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);

const forbiddenPath = /(^|\/)(test-results|playwright-report|blob-report|chrome-[^/]+)(\/|$)|(^|\/)(Cookies|Login Data|Web Data|Account Web Data|Safe Browsing Cookies|Local State)$/i;
const sensitiveContent = /(-----BEGIN (?:RSA |EC )?PRIVATE KEY-----|(?:sk|rk)-[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9_]{20,}|eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,})/;
const violations = [];

for (const relativePath of tracked) {
  if (forbiddenPath.test(relativePath)) {
    violations.push(`${relativePath}: forbidden generated/browser artifact path`);
    continue;
  }

  const absolutePath = path.join(repoRoot, relativePath);
  if (!existsSync(absolutePath)) continue;

  let contents;
  try {
    contents = readFileSync(absolutePath, "utf8");
  } catch {
    continue;
  }

  if (sensitiveContent.test(contents)) {
    violations.push(`${relativePath}: possible credential/token material`);
  }
}

if (violations.length > 0) {
  console.error(`Repository hygiene failed with ${violations.length} violation(s):`);
  for (const violation of violations.slice(0, 20)) console.error(`- ${violation}`);
  if (violations.length > 20) console.error(`- ... ${violations.length - 20} more`);
  process.exit(1);
}

console.log(`Repository hygiene passed for ${tracked.length} tracked files.`);
