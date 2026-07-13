import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const htmlTemplate = readFileSync(
  new URL("../../supabase/auth/magic-link-email.html", import.meta.url),
  "utf8"
);
const textTemplate = readFileSync(
  new URL("../../supabase/auth/magic-link-email.txt", import.meta.url),
  "utf8"
);

describe("Supabase magic-link email template", () => {
  it("uses Garden.io copy and the Supabase confirmation URL", () => {
    expect(htmlTemplate).toContain("Garden.io");
    expect(htmlTemplate).toContain("Your garden, smarter.");
    expect(htmlTemplate).toContain("Open Garden.io");
    expect(htmlTemplate).toContain("{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=magiclink");
    expect(textTemplate).toContain("{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=magiclink");
    expect(htmlTemplate).not.toContain("{{ .ConfirmationURL }}");
  });

  it("does not keep the default Supabase magic-link messaging", () => {
    expect(htmlTemplate).not.toContain("Supabase Auth");
    expect(htmlTemplate).not.toContain("Magic Link");
    expect(htmlTemplate).not.toContain("Follow this link to login");
    expect(htmlTemplate).not.toContain("Log In");
  });
});
