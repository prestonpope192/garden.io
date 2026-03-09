import { z } from "zod";
import type { WaitlistMailer, WaitlistRepository } from "@/lib/waitlist-types";

const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  name: z.string().trim().max(120).optional().transform((name) => (name ? name : undefined)),
  company: z.string().trim().max(200).optional()
});

export type WaitlistSignupResult =
  | {
      ok: true;
      message: string;
      emailChannel: "resend" | "supabase_otp";
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

export type WaitlistServiceDependencies = {
  repository: WaitlistRepository;
  mailer: WaitlistMailer;
};

function isRecoverableRepositoryFailure(errorMessage: string): boolean {
  const normalized = errorMessage.toLowerCase();
  return (
    normalized.includes("could not find the table") ||
    normalized.includes("row-level security") ||
    normalized.includes("permission denied")
  );
}

export async function processWaitlistSignup(
  payload: unknown,
  dependencies: WaitlistServiceDependencies
): Promise<WaitlistSignupResult> {
  const parsed = waitlistSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      message: "Please enter a valid email address."
    };
  }

  if (parsed.data.company) {
    return {
      ok: true,
      emailChannel: "supabase_otp",
      message: "You are on the waitlist. Check your email for confirmation."
    };
  }

  try {
    const input = {
      email: parsed.data.email,
      name: parsed.data.name
    };

    try {
      await dependencies.repository.add(input);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (!isRecoverableRepositoryFailure(message)) {
        throw error;
      }
    }

    const receipt = await dependencies.mailer.sendWelcome(input);

    return {
      ok: true,
      emailChannel: receipt.channel,
      message: "You are on the waitlist. Check your email for confirmation."
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown signup error";

    return {
      ok: false,
      status: 500,
      message
    };
  }
}
