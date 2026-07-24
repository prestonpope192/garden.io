import { NextResponse } from "next/server";

// Weather data source: Open-Meteo (free, no API key, CORS-friendly).
// Two modes on one route:
//   ?geocode=<place|zip>  -> candidate locations to set on a property (once).
//   ?lat=&lon=            -> daily minimum-temperature forecast for frost alerts.
// Forecasts are cached server-side so repeated views don't re-hit the provider.

export const runtime = "nodejs";

const FORECAST_DAYS = 7;
const FORECAST_TTL_SECONDS = 3 * 60 * 60; // 3h — frost forecasts move slowly.
const GEOCODE_TTL_SECONDS = 24 * 60 * 60;

type GeocodeMatch = {
  name: string;
  latitude: number;
  longitude: number;
  admin1: string | null;
  country: string | null;
  label: string;
};

type ForecastDay = { date: string; lowF: number };

async function geocode(query: string): Promise<GeocodeMatch[]> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  const res = await fetch(url, { next: { revalidate: GEOCODE_TTL_SECONDS } });
  if (!res.ok) throw new Error("Geocoding service unavailable.");
  const data = (await res.json()) as {
    results?: Array<{
      name: string;
      latitude: number;
      longitude: number;
      admin1?: string;
      country?: string;
      country_code?: string;
    }>;
  };
  return (data.results ?? []).map((r) => ({
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    admin1: r.admin1 ?? null,
    country: r.country ?? null,
    label: [r.name, r.admin1, r.country_code ?? r.country].filter(Boolean).join(", "),
  }));
}

async function forecast(lat: number, lon: number): Promise<ForecastDay[]> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("daily", "temperature_2m_min");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("forecast_days", String(FORECAST_DAYS));
  url.searchParams.set("timezone", "auto");
  const res = await fetch(url, { next: { revalidate: FORECAST_TTL_SECONDS } });
  if (!res.ok) throw new Error("Weather service unavailable.");
  const data = (await res.json()) as {
    daily?: { time?: string[]; temperature_2m_min?: number[] };
  };
  const times = data.daily?.time ?? [];
  const lows = data.daily?.temperature_2m_min ?? [];
  return times.map((date, i) => ({ date, lowF: lows[i] })).filter((d) => typeof d.lowF === "number");
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("geocode")?.trim();
    if (q) {
      if (q.length < 2) return NextResponse.json({ ok: true, matches: [] });
      return NextResponse.json({ ok: true, matches: await geocode(q) });
    }

    const lat = Number(url.searchParams.get("lat"));
    const lon = Number(url.searchParams.get("lon"));
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return NextResponse.json(
        { ok: false, message: "Provide ?geocode=<place> or ?lat=&lon=." },
        { status: 400 }
      );
    }
    return NextResponse.json({ ok: true, days: await forecast(lat, lon) });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Weather request failed." },
      { status: 502 }
    );
  }
}
