"use client";

import { useEffect, useState } from "react";

const DEFAULT_NEXT_PATH = "/app/my-property";

export function safeNextPath(value: string | null, origin = window.location.origin) {
  if (!value) {
    return DEFAULT_NEXT_PATH;
  }

  const target = new URL(value, origin);

  return target.origin === origin
    ? `${target.pathname}${target.search}${target.hash}`
    : DEFAULT_NEXT_PATH;
}

function withAuthState(path: string, auth: "invalid_link") {
  const url = new URL(path, window.location.origin);
  url.searchParams.set("auth", auth);
  return `${url.pathname}${url.search}${url.hash}`;
}

function authPayload(searchParams: URLSearchParams, hashParams: URLSearchParams) {
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (tokenHash && type) {
    return {
      token_hash: tokenHash,
      type
    };
  }

  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");

  if (accessToken && refreshToken) {
    return {
      access_token: accessToken,
      refresh_token: refreshToken
    };
  }

  return null;
}

export default function AuthConfirmPage() {
  const [message, setMessage] = useState("Opening your garden...");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const nextPath = safeNextPath(searchParams.get("next"));
    const payload = authPayload(searchParams, hashParams);

    if (!payload) {
      window.location.replace(withAuthState(nextPath, "invalid_link"));
      return;
    }

    fetch("/api/auth/session", {
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json"
      },
      method: "POST"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid garden link");
        }
        window.location.replace(nextPath);
      })
      .catch(() => {
        setMessage("That garden link is invalid or expired.");
        window.location.replace(withAuthState(nextPath, "invalid_link"));
      });
  }, []);

  return (
    <main className="garden-auth">
      <section className="garden-auth__panel" aria-live="polite">
        <h1>{message}</h1>
      </section>
    </main>
  );
}
