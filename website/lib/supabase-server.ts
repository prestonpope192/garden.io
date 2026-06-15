import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";

// Server-side Supabase client that reads the caller's session from request
// cookies. Used by API routes that must be scoped to the signed-in user
// (e.g. the AI diagnosis route, which spends money per call).

export function getServerSupabaseConfig():
  | { supabaseUrl: string; supabaseAnonKey: string }
  | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return { supabaseUrl, supabaseAnonKey };
}

export function createRequestSupabaseClient(request: NextRequest) {
  const config = getServerSupabaseConfig();
  if (!config) {
    return null;
  }

  return createServerClient(config.supabaseUrl, config.supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      // Route handlers don't mutate the session here; no-op the writes.
      setAll: () => {}
    }
  });
}

/**
 * Returns the authenticated user for this request, or null if there is no
 * valid session. Uses getUser() (validates the JWT with Supabase) rather than
 * getSession() (which only decodes the cookie).
 */
export async function getRequestUser(request: NextRequest) {
  const supabase = createRequestSupabaseClient(request);
  if (!supabase) {
    return { configured: false as const, user: null };
  }
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return { configured: true as const, user };
}
