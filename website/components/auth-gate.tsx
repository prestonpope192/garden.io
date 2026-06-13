"use client";

import type { Session } from "@supabase/supabase-js";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient, getBrowserSupabaseConfig } from "@/lib/supabase-browser";
import { SpecimenLabel } from "@/components/journal-primitives";

type AuthGateProps = {
  children: (session: Session) => ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const hasSupabaseConfig = Boolean(getBrowserSupabaseConfig());
  const supabase = useMemo(
    () => (hasSupabaseConfig ? createBrowserSupabaseClient() : null),
    [hasSupabaseConfig]
  );
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"loading" | "idle" | "sending" | "sent" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!supabase) {
      setStatus("error");
      setMessage("Supabase environment variables are required before the private beta app can run.");
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session);
      setStatus("idle");
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setStatus("idle");
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  const sendLoginLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setStatus("error");
      setMessage("Supabase environment variables are required before the private beta app can run.");
      return;
    }

    setStatus("sending");
    setMessage("");

    const redirectTo =
      typeof window === "undefined" ? undefined : `${window.location.origin}/app`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true
      }
    });

    if (error) {
      setStatus("error");
      setMessage("Unable to send the sign-in link. Please try again.");
      return;
    }

    setStatus("sent");
    setMessage("Check your email for the Garden.io sign-in link.");
  };

  if (session) {
    return <>{children(session)}</>;
  }

  return (
    <main className="private-beta-auth">
      <section className="private-beta-auth__panel">
        <SpecimenLabel tone="olive">Private beta</SpecimenLabel>
        <h1>Sign in to your Garden.io records.</h1>
        <p>
          Marketing and the plant catalogue stay public. Garden records require a signed-in account so
          every property, bed, plant, note, and task remains private.
        </p>

        <form className="private-beta-auth__form" onSubmit={sendLoginLink}>
          <label htmlFor="garden-auth-email">Email</label>
          <input
            id="garden-auth-email"
            className="input"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
          <button className="button" disabled={status === "loading" || status === "sending"} type="submit">
            {status === "sending" ? "Sending..." : "Send sign-in link"}
          </button>
        </form>

        {message ? (
          <p className={`message ${status === "error" ? "error" : "ok"}`} role={status === "error" ? "alert" : "status"}>
            {message}
          </p>
        ) : null}
      </section>
    </main>
  );
}
