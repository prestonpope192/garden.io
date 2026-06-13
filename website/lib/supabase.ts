import { createClient } from "@supabase/supabase-js";
import type { WaitlistConfig } from "@/lib/env";

export function createWaitlistSupabaseClient(config: WaitlistConfig) {
  const key = config.supabaseServiceRoleKey ?? config.supabaseAnonKey;

  return createClient(config.supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function createSupabaseServiceClient(config: WaitlistConfig) {
  if (!config.supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
