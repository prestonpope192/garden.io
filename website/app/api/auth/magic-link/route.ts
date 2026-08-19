import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getServerSupabaseConfig } from "@/lib/supabase-server";
import { checkMagicLinkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function authRedirect(request: Request, auth: "invalid_email" | "missing_config" | "send_failed" | "sent" | "rate_limited") {
  const redirectUrl = new URL("/app/my-property", request.url);
  redirectUrl.searchParams.set("auth", auth);
  return NextResponse.redirect(redirectUrl, 303);
}

function authCallbackUrl(request: Request) {
  const callbackUrl = new URL("/auth/confirm", request.url);
  callbackUrl.searchParams.set("next", "/app/my-property");
  return callbackUrl.toString();
}

function normalizeEmail(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = normalizeEmail(formData.get("email"));

  if (!isValidEmail(email)) {
    return authRedirect(request, "invalid_email");
  }

  const config = getServerSupabaseConfig();
  if (!config) {
    return authRedirect(request, "missing_config");
  }

  const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limited = await checkMagicLinkRateLimit(supabase, email, forwardedFor);
  if (!limited.ok) {
    return authRedirect(request, limited.status === 429 ? "rate_limited" : "send_failed");
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: authCallbackUrl(request),
      shouldCreateUser: true
    }
  });

  return authRedirect(request, error ? "send_failed" : "sent");
}
