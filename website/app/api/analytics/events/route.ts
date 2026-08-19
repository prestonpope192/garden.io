import { NextRequest, NextResponse } from "next/server";
import { createRequestSupabaseClient } from "@/lib/supabase-server";
import { isProductEventName, sanitizeProductEventMetadata } from "@/lib/product-events";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const supabase = createRequestSupabaseClient(request);
  if (!supabase) return NextResponse.json({ ok: false, message: "Analytics is not configured." }, { status: 503 });

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, message: "Please sign in." }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { eventName?: unknown; metadata?: unknown };
  if (!isProductEventName(body.eventName)) {
    return NextResponse.json({ ok: false, message: "That garden event is not supported." }, { status: 400 });
  }

  const { error } = await supabase.from("garden_product_events").insert({
    user_id: user.id,
    event_name: body.eventName,
    metadata: sanitizeProductEventMetadata(body.metadata)
  });
  if (error) return NextResponse.json({ ok: false, message: "We couldn't record that garden event." }, { status: 503 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
