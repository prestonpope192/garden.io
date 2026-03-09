import { loadWaitlistConfig } from "@/lib/env";
import { createWaitlistSupabaseClient } from "@/lib/supabase";
import { HybridWaitlistMailer } from "@/lib/waitlist-mailer";
import { SupabaseWaitlistRepository } from "@/lib/waitlist-repository";
import type { WaitlistServiceDependencies } from "@/lib/waitlist-service";

export function createWaitlistDependencies(): WaitlistServiceDependencies {
  const config = loadWaitlistConfig();
  const client = createWaitlistSupabaseClient(config);

  return {
    repository: new SupabaseWaitlistRepository(client, config.waitlistTable),
    mailer: new HybridWaitlistMailer(config, client)
  };
}
