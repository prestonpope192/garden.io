import { NextResponse } from "next/server";
import { createWaitlistDependencies } from "@/lib/waitlist-dependencies";
import { processWaitlistSignup } from "@/lib/waitlist-service";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
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
