"use client";

import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import type { FormEvent, MouseEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient, getBrowserSupabaseConfig } from "@/lib/supabase-browser";
import { SpecimenLabel } from "@/components/journal-primitives";
import { isSampleGardenEnabled } from "@/lib/sample-garden";

type AuthGateProps = {
  children: (session: Session) => ReactNode;
  authResult?: AuthGateResult | null;
};

export type AuthGateResult = {
  status: "sent" | "error";
  message: string;
};

export const SIGN_IN_UNAVAILABLE_MESSAGE =
  "We can't open your garden right now. You can still tour a garden journal or choose plants for the beds you have.";
export const SIGN_IN_SENT_MESSAGE =
  "Check your email for your sign-in link.";
export const SIGN_IN_SEND_FAILED_MESSAGE =
  "We couldn't send the link. Please try again in a moment.";

const validateEmail = (value: string) => {
  const normalizedEmail = value.trim();

  if (!normalizedEmail) {
    return "Enter your email to start your garden.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return "Enter a valid email address.";
  }

  return "";
};

export function AuthGate({ authResult = null, children }: AuthGateProps) {
  const hasSupabaseConfig = Boolean(getBrowserSupabaseConfig());
  const sampleGardenEnabled = isSampleGardenEnabled();
  const supabase = useMemo(
    () => (hasSupabaseConfig ? createBrowserSupabaseClient() : null),
    [hasSupabaseConfig]
  );
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"loading" | "idle" | "sending" | "sent" | "error">(
    authResult?.status ?? "loading"
  );
  const [message, setMessage] = useState(authResult?.message ?? "");

  useEffect(() => {
    if (!supabase) {
      setStatus("error");
      setMessage(SIGN_IN_UNAVAILABLE_MESSAGE);
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session);
      setStatus((currentStatus) =>
        currentStatus === "error" || currentStatus === "sent" ? currentStatus : "idle"
      );
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setStatus((currentStatus) =>
        currentStatus === "error" || currentStatus === "sent" ? currentStatus : "idle"
      );
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  const sendLoginLink = async (
    event?: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    event?.preventDefault();
    if (!supabase) {
      setStatus("error");
      setMessage(SIGN_IN_UNAVAILABLE_MESSAGE);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const validationMessage = validateEmail(normalizedEmail);

    if (validationMessage) {
      setStatus("error");
      setMessage(validationMessage);
      return;
    }

    setStatus("sending");
    setMessage("");

    const redirectTo =
      typeof window === "undefined" ? undefined : `${window.location.origin}/app`;

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true
      }
    });

    if (error) {
      setStatus("error");
      setMessage(SIGN_IN_SEND_FAILED_MESSAGE);
      return;
    }

    setStatus("sent");
    setMessage(SIGN_IN_SENT_MESSAGE);
  };

  if (status === "loading") {
    return <div className="garden-auth" aria-label="Loading..." />;
  }

  if (session) {
    return <>{children(session)}</>;
  }

  return (
    <main className="garden-auth">
      <section className="garden-auth__panel">
        <SpecimenLabel tone="olive">Start your garden</SpecimenLabel>
        <h1>Your garden, smarter.</h1>
        <p>
          Save what you notice. Get care advice that remembers your plants.
        </p>
        <div className="garden-auth__first-steps" aria-label="Why start a garden notebook">
          <strong>Start with one plant.</strong>
          <p>Name where it grows so notes, photos, and care can stay together.</p>
        </div>
        <p>Enter your email. We&apos;ll send a link to start your garden.</p>

        <form
          action="/api/auth/magic-link"
          className="garden-auth__form"
          method="post"
          onSubmit={sendLoginLink}
          noValidate
        >
          <label htmlFor="garden-auth-email">Email address</label>
          <input
            id="garden-auth-email"
            className="input"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (supabase && (status === "error" || status === "sent")) {
                setStatus("idle");
                setMessage("");
              }
            }}
            placeholder="you@example.com"
          />
          <button
            className="button"
            disabled={status === "sending"}
            type="submit"
          >
            {status === "sending" ? "Sending..." : "Email me a start link"}
          </button>
        </form>

        {message ? (
          <p className={`message ${status === "error" ? "error" : "ok"}`} role={status === "error" ? "alert" : "status"}>
            {message}
          </p>
        ) : null}

        <div className="garden-auth__links">
          {sampleGardenEnabled ? (
            <Link className="garden-auth__secondary" href="/tour">
              Tour a garden journal
            </Link>
          ) : null}
          <Link className="garden-auth__secondary" href="/catalog">
            Choose plants
          </Link>
        </div>
      </section>
    </main>
  );
}
