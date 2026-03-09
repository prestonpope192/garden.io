import { describe, expect, it, vi } from "vitest";
import { processWaitlistSignup } from "@/lib/waitlist-service";

describe("processWaitlistSignup", () => {
  it("rejects invalid email addresses", async () => {
    const result = await processWaitlistSignup(
      { email: "not-an-email" },
      {
        repository: { add: vi.fn() },
        mailer: { sendWelcome: vi.fn() }
      }
    );

    expect(result).toEqual({
      ok: false,
      status: 400,
      message: "Please enter a valid email address."
    });
  });

  it("ignores bot honeypot payloads", async () => {
    const add = vi.fn();
    const sendWelcome = vi.fn();

    const result = await processWaitlistSignup(
      {
        email: "person@example.com",
        company: "Bot Company"
      },
      {
        repository: { add },
        mailer: { sendWelcome }
      }
    );

    expect(result.ok).toBe(true);
    expect(add).not.toHaveBeenCalled();
    expect(sendWelcome).not.toHaveBeenCalled();
  });

  it("stores and emails valid signups", async () => {
    const add = vi.fn().mockResolvedValue(undefined);
    const sendWelcome = vi.fn().mockResolvedValue({ channel: "resend" });

    const result = await processWaitlistSignup(
      {
        email: "  PERSON@EXAMPLE.COM  ",
        name: " Preston "
      },
      {
        repository: { add },
        mailer: { sendWelcome }
      }
    );

    expect(result).toEqual({
      ok: true,
      emailChannel: "resend",
      message: "You are on the waitlist. Check your email for confirmation."
    });

    expect(add).toHaveBeenCalledWith({
      email: "person@example.com",
      name: "Preston"
    });
    expect(sendWelcome).toHaveBeenCalledWith({
      email: "person@example.com",
      name: "Preston"
    });
  });

  it("falls back to email-only flow when table is missing", async () => {
    const sendWelcome = vi.fn().mockResolvedValue({ channel: "supabase_otp" });

    const result = await processWaitlistSignup(
      {
        email: "person@example.com"
      },
      {
        repository: {
          add: vi
            .fn()
            .mockRejectedValue(
              new Error("WAITLIST_INSERT_FAILED: Could not find the table 'public.waitlist_signups'")
            )
        },
        mailer: { sendWelcome }
      }
    );

    expect(result).toEqual({
      ok: true,
      emailChannel: "supabase_otp",
      message: "You are on the waitlist. Check your email for confirmation."
    });
    expect(sendWelcome).toHaveBeenCalledTimes(1);
  });

  it("returns server errors when email sending fails", async () => {
    const result = await processWaitlistSignup(
      {
        email: "person@example.com"
      },
      {
        repository: {
          add: vi.fn().mockResolvedValue(undefined)
        },
        mailer: {
          sendWelcome: vi.fn().mockRejectedValue(new Error("WAITLIST_EMAIL_FAILED: provider down"))
        }
      }
    );

    expect(result).toEqual({
      ok: false,
      status: 500,
      message: "WAITLIST_EMAIL_FAILED: provider down"
    });
  });
});
