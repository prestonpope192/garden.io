import { vi } from "vitest";
import type { Session, User } from "@supabase/supabase-js";

/**
 * A lightweight, hand-rolled stand-in for the subset of the Supabase JS
 * client surface that components/garden-app.tsx exercises:
 *   - supabase.from(table).select(...).order(...)                    -> awaited directly
 *   - supabase.from(table).insert(payload).select("id").single()     -> awaited via .single()
 *   - supabase.from(table).insert(payload)                           -> awaited directly
 *   - supabase.from(table).update(patch).eq(...)                     -> awaited directly
 *   - supabase.from(table).delete().eq(...)[.eq(...)]                -> awaited directly
 *   - supabase.from(table).upsert(payload, options)                  -> awaited directly
 *   - supabase.storage.from(bucket).createSignedUrls(...) / .upload(...)
 *   - supabase.auth.getSession() / .onAuthStateChange() / .signOut()
 *
 * Each table's behavior is configurable per-test. A behavior value may be a
 * single result reused for every call, or an array of results consumed in
 * call order (the last entry repeats once the array is exhausted) so a
 * table's initial-load select and its post-mutation reload select can be
 * made to differ or one of them can hang until manually resolved.
 */

type SelectResult = { data: unknown[] | null; error: { message: string } | null };
type SingleResult = { data: { id: string } | null; error: { message: string } | null };
type MutateResult = { error: { message: string } | null };

type Resolvable<T> = T | (() => T | Promise<T>);
type Queued<T> = Resolvable<T> | Array<Resolvable<T>>;

export type TableBehavior = {
  select?: Queued<SelectResult>;
  insertSingle?: Queued<SingleResult>;
  insert?: Queued<MutateResult>;
  update?: Queued<MutateResult>;
  delete?: Queued<MutateResult>;
  upsert?: Queued<MutateResult>;
};

export type MutationLogEntry = {
  table: string;
  op: "insert" | "update" | "delete" | "upsert";
  payload: unknown;
};

const DEFAULT_SELECT: SelectResult = { data: [], error: null };
const DEFAULT_SINGLE: SingleResult = { data: { id: "mock-id" }, error: null };
const DEFAULT_MUTATE: MutateResult = { error: null };

async function resolveQueued<T>(
  queued: Queued<T> | undefined,
  fallback: T,
  callIndex: number
): Promise<T> {
  if (queued === undefined) return fallback;
  const picked = Array.isArray(queued) ? queued[Math.min(callIndex, queued.length - 1)] : queued;
  return typeof picked === "function" ? await (picked as () => T | Promise<T>)() : picked;
}

/** Builds a fixture Session/User pair satisfying @supabase/supabase-js's types. */
export function createMockSession(overrides: { id?: string; email?: string } = {}): Session {
  const user: User = {
    id: overrides.id ?? "user-1",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2026-01-01T00:00:00Z",
    email: overrides.email ?? "gardener@example.com"
  };

  return {
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    expires_in: 3600,
    token_type: "bearer",
    user
  };
}

export function createMockSupabaseClient(options: { session: Session; tables?: Record<string, TableBehavior> }) {
  const tables = options.tables ?? {};
  const fromCalls: string[] = [];
  const mutations: MutationLogEntry[] = [];
  const callCounters = new Map<string, number>();

  function nextIndex(table: string, op: string) {
    const key = `${table}:${op}`;
    const idx = callCounters.get(key) ?? 0;
    callCounters.set(key, idx + 1);
    return idx;
  }

  function createBuilder(table: string) {
    const behavior = tables[table] ?? {};
    let mode: "select" | "insertSingle" | "insert" | "update" | "delete" | "upsert" | null = null;

    async function resolve(): Promise<SelectResult | SingleResult | MutateResult> {
      switch (mode) {
        case "select":
          return resolveQueued(behavior.select, DEFAULT_SELECT, nextIndex(table, "select"));
        case "insertSingle":
          return resolveQueued(behavior.insertSingle, DEFAULT_SINGLE, nextIndex(table, "insertSingle"));
        case "insert":
          return resolveQueued(behavior.insert, DEFAULT_MUTATE, nextIndex(table, "insert"));
        case "update":
          return resolveQueued(behavior.update, DEFAULT_MUTATE, nextIndex(table, "update"));
        case "delete":
          return resolveQueued(behavior.delete, DEFAULT_MUTATE, nextIndex(table, "delete"));
        case "upsert":
          return resolveQueued(behavior.upsert, DEFAULT_MUTATE, nextIndex(table, "upsert"));
        default:
          return DEFAULT_SELECT;
      }
    }

    const builder: any = {
      select: (..._args: unknown[]) => {
        if (mode === "insert") {
          mode = "insertSingle";
        } else if (mode === null) {
          mode = "select";
        }
        return builder;
      },
      order: (..._args: unknown[]) => builder,
      eq: (..._args: unknown[]) => builder,
      insert: (payload: unknown) => {
        mode = "insert";
        mutations.push({ table, op: "insert", payload });
        return builder;
      },
      update: (payload: unknown) => {
        mode = "update";
        mutations.push({ table, op: "update", payload });
        return builder;
      },
      delete: () => {
        mode = "delete";
        mutations.push({ table, op: "delete", payload: undefined });
        return builder;
      },
      upsert: (payload: unknown, upsertOptions?: unknown) => {
        mode = "upsert";
        mutations.push({ table, op: "upsert", payload: { payload, upsertOptions } });
        return builder;
      },
      single: () => {
        mode = "insertSingle";
        return resolve();
      },
      then: (onFulfilled: (value: any) => unknown, onRejected?: (reason: unknown) => unknown) =>
        resolve().then(onFulfilled, onRejected)
    };

    return builder;
  }

  const client = {
    from: vi.fn((table: string) => {
      fromCalls.push(table);
      return createBuilder(table);
    }),
    storage: {
      from: vi.fn((_bucket: string) => ({
        createSignedUrls: vi.fn().mockResolvedValue({ data: [], error: null }),
        upload: vi.fn().mockResolvedValue({ data: { path: "mock-path" }, error: null })
      }))
    },
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: options.session }, error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signOut: vi.fn().mockResolvedValue({ error: null })
    }
  };

  return {
    client,
    /** Table names in the order `.from(table)` was invoked. */
    fromCalls,
    /** Count of `.from(table)` invocations so far. */
    countFrom(table: string) {
      return fromCalls.filter((entry) => entry === table).length;
    },
    /** insert/update/delete/upsert calls in the order they were made. */
    mutations
  };
}

/** Installs a `fetch` stub that answers /api/plant-profiles with the given profiles. */
export function stubPlantProfilesFetch(profiles: unknown[] = []) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    if (url.includes("/api/plant-profiles")) {
      return new Response(JSON.stringify({ ok: true, profiles }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ ok: false, message: `Unhandled fetch in test: ${url}` }), {
      status: 404,
      headers: { "content-type": "application/json" }
    });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

/** A deferred promise, useful for holding a mocked query pending until the test resolves it. */
export function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
