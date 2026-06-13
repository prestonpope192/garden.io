import { Resend } from "resend";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { WaitlistConfig } from "@/lib/env";
import type { WaitlistEmailInput, WaitlistMailer } from "@/lib/waitlist-types";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

function welcomeHtml(name?: string): string {
  const greeting = name ? `Hi ${escapeHtml(name)},` : "Hi there,";

  return [
    `<p>${greeting}</p>`,
    "<p>You are officially on the Garden.io waitlist.</p>",
    "<p>We will send your launch invite as soon as we open access.</p>",
    "<p>Thanks for growing with us,<br/>Garden.io</p>"
  ].join("");
}

export class HybridWaitlistMailer implements WaitlistMailer {
  constructor(
    private readonly config: WaitlistConfig,
    private readonly supabaseClient: SupabaseClient
  ) {}

  async sendWelcome(input: WaitlistEmailInput): Promise<{ channel: "resend" | "supabase_otp" }> {
    if (this.config.resendApiKey && this.config.waitlistFromEmail) {
      const resend = new Resend(this.config.resendApiKey);
      const { error } = await resend.emails.send({
        from: this.config.waitlistFromEmail,
        to: [input.email],
        subject: "You are on the Garden.io waitlist",
        html: welcomeHtml(input.name)
      });

      if (error) {
        throw new Error(`WAITLIST_EMAIL_FAILED: ${error.message}`);
      }

      return { channel: "resend" };
    }

    const { error } = await this.supabaseClient.auth.signInWithOtp({
      email: input.email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: this.config.waitlistEmailRedirectTo,
        data: {
          waitlist: true,
          name: input.name ?? null
        }
      }
    });

    if (error) {
      throw new Error(`WAITLIST_EMAIL_FAILED: ${error.message}`);
    }

    return { channel: "supabase_otp" };
  }
}
