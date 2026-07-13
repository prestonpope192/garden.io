import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getServerSupabaseConfig } from "@/lib/supabase-server";

export const runtime = "nodejs";

type SessionRequestBody = {
  access_token?: string;
  refresh_token?: string;
  token_hash?: string;
  type?: EmailOtpType;
};

function authSessionResponse(status: number, body: { ok: boolean; message?: string }) {
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return authSessionResponse(403, {
      ok: false,
      message: "Garden sign-in requests must come from this site."
    });
  }

  const config = getServerSupabaseConfig();
  if (!config) {
    return authSessionResponse(503, { ok: false, message: "Supabase is not configured." });
  }

  const body = (await request.json().catch(() => ({}))) as SessionRequestBody;
  const response = authSessionResponse(200, { ok: true });
  const supabase = createServerClient(config.supabaseUrl, config.supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  if (body.token_hash && body.type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: body.token_hash,
      type: body.type
    });

    return error
      ? authSessionResponse(400, { ok: false, message: "The garden link is invalid or expired." })
      : response;
  }

  if (body.access_token && body.refresh_token) {
    const { error } = await supabase.auth.setSession({
      access_token: body.access_token,
      refresh_token: body.refresh_token
    });

    return error
      ? authSessionResponse(400, { ok: false, message: "The garden link is invalid or expired." })
      : response;
  }

  return authSessionResponse(400, { ok: false, message: "The garden link is missing sign-in details." });
}
