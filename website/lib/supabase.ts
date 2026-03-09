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
