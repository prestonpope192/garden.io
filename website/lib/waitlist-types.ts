export type WaitlistEmailInput = {
  email: string;
  name?: string;
};

export interface WaitlistRepository {
  add(input: WaitlistEmailInput): Promise<void>;
}

export interface WaitlistMailer {
  sendWelcome(input: WaitlistEmailInput): Promise<{ channel: "resend" | "supabase_otp" }>;
}
