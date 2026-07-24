import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projectRef = process.env.SUPABASE_PROJECT_REF ?? "koeawpuagswysumwuidc";
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

if (!accessToken) {
  console.error("Set SUPABASE_ACCESS_TOKEN to a Supabase Management API access token.");
  process.exit(1);
}

const html = readFileSync(resolve(rootDir, "supabase/auth/magic-link-email.html"), "utf8");

const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/config/auth`, {
  body: JSON.stringify({
    mailer_subjects_magic_link: "Open Garden.io",
    mailer_templates_magic_link_content: html
  }),
  headers: {
    authorization: `Bearer ${accessToken}`,
    "content-type": "application/json"
  },
  method: "PATCH"
});

if (!response.ok) {
  const text = await response.text();
  throw new Error(`Supabase template update failed (${response.status}): ${text}`);
}

console.log(`Updated Supabase Magic Link template for ${projectRef}.`);
