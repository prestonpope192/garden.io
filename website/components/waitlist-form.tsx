"use client";

import React, { FormEvent, useMemo, useState } from "react";

type WaitlistResponse = {
  ok: boolean;
  message?: string;
};

type WaitlistFormProps = {
  idPrefix?: string;
  submitLabel?: string;
};

export function WaitlistForm({
  idPrefix = "waitlist",
  submitLabel = "Join Waitlist"
}: WaitlistFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const ids = useMemo(
    () => ({
      name: `${idPrefix}-name`,
      email: `${idPrefix}-email`,
      company: `${idPrefix}-company`
    }),
    [idPrefix]
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company: "" })
      });

      const json = (await response.json()) as WaitlistResponse;

      if (!response.ok || !json.ok) {
        throw new Error(json.message ?? "Unable to join the waitlist.");
      }

      setStatus("success");
      setMessage(json.message ?? "You are on the waitlist. Check your email for confirmation.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to join the waitlist.");
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <label htmlFor={ids.name}>Name (optional)</label>
      <input
        id={ids.name}
        className="input"
        type="text"
        autoComplete="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Your name"
      />

      <label htmlFor={ids.email}>Email</label>
      <input
        id={ids.email}
        className="input"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
      />

      <label htmlFor={ids.company} className="sr-only">
        Company
      </label>
      <input
        id={ids.company}
        name="company"
        className="sr-only"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />

      <button className="button" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Joining..." : submitLabel}
      </button>

      {status === "success" && (
        <p className="message ok" role="status">
          {message}
        </p>
      )}
      {status === "error" && (
        <p className="message error" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
