import { NextResponse } from "next/server";
import { createWaitlistDependencies } from "@/lib/waitlist-dependencies";
import { checkWaitlistRateLimit } from "@/lib/rate-limit";
import { processWaitlistSignup } from "@/lib/waitlist-service";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const email = typeof payload?.email === "string" ? payload.email : undefined;
    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ip = forwardedFor || request.headers.get("x-real-ip") || "unknown";
    const rateLimit = checkWaitlistRateLimit({ ip, email });

    if (!rateLimit.ok) {
      return NextResponse.json(
        { ok: false, message: rateLimit.message },
        { status: rateLimit.status }
      );
    }

    const result = await processWaitlistSignup(payload, createWaitlistDependencies());

    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: result.status });
    }

    return NextResponse.json({ ok: true, message: result.message, emailChannel: result.emailChannel });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Unable to process signup request." },
      { status: 400 }
    );
  }
}
