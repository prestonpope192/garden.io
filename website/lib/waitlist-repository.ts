import { type SupabaseClient } from "@supabase/supabase-js";
import type { WaitlistEmailInput, WaitlistRepository } from "@/lib/waitlist-types";

export class SupabaseWaitlistRepository implements WaitlistRepository {
  constructor(
    private readonly client: SupabaseClient,
    private readonly waitlistTable: string
  ) {}

  async add(input: WaitlistEmailInput): Promise<void> {
    const { error } = await this.client
      .from(this.waitlistTable)
      .upsert(
        {
          email: input.email,
          name: input.name ?? null,
          source: "website",
          created_at: new Date().toISOString()
        },
        {
          onConflict: "email",
          ignoreDuplicates: true
        }
      );

    if (error) {
      throw new Error(`WAITLIST_INSERT_FAILED: ${error.message}`);
    }
  }
}
