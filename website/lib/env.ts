export type WaitlistConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey?: string;
  waitlistTable: string;
  resendApiKey?: string;
  waitlistFromEmail?: string;
  waitlistEmailRedirectTo?: string;
};

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export function loadWaitlistConfig(): WaitlistConfig {
  const supabaseAnonKey =
    optionalEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
    optionalEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY");

  if (!supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)"
    );
  }

  return {
    supabaseUrl: requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey,
    supabaseServiceRoleKey: optionalEnv("SUPABASE_SERVICE_ROLE_KEY"),
    waitlistTable: optionalEnv("WAITLIST_TABLE") ?? "waitlist_signups",
    resendApiKey: optionalEnv("RESEND_API_KEY"),
    waitlistFromEmail: optionalEnv("WAITLIST_FROM_EMAIL"),
    waitlistEmailRedirectTo: optionalEnv("WAITLIST_EMAIL_REDIRECT_TO")
  };
}
