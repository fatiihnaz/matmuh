/**
 * @file Framework-free auth client for the matmuh backend's cookie + refresh
 * flow. One instance per tab (module singleton), shared by every consumer so a
 * single access token and a single in-flight refresh are reused.
 *
 * Refresh discipline is the whole point: the backend rotates the refresh token
 * on every use and treats reuse of a retired one as an attack, revoking the
 * entire session family. So refreshes are single-flight within a tab (promise
 * dedup) and serialized across tabs (Web Locks; where unsupported the dedup
 * stands alone). The access token lives only in memory: the cookies are
 * HttpOnly and we never read them, the token arrives in the refresh response
 * body instead.
 */

// Same-origin in production (the frontend and /api share the host), which is
// what lets the SameSite=Lax cookies ride along on the refresh call. A relative
// base is therefore correct; override only for a dev proxy fronting the backend
// on this origin.
const API = process.env.NEXT_PUBLIC_API_URL || "/api";

// Count a token as stale this many ms before its real expiry, so a request
// never leaves with a token about to die in flight.
const STALE_SKEW_MS = 30_000;

const LOCK = "matmuh-auth-refresh";
const HINT_KEY = "matmuh:auth-hint";
// Appended to the post-login return URL so the provider knows to run the token
// exchange on the way back: a first login has set no session hint yet.
const CALLBACK_PARAM = "auth";
const CALLBACK_VALUE = "callback";

/** @type {string} */
let accessToken = "";
let expiresAt = 0;
/** @type {Promise<boolean> | null} */
let inflight = null;

/** @type {Set<() => void>} */
const listeners = new Set();
/** @type {(() => void) | null} */
let unwatch = null;

const emit = () => {
  for (const cb of [...listeners]) cb();
};

// Boolean-only breadcrumb, never a credential: "a session may exist here", so
// anonymous visitors skip the refresh probe and its round trip. Wrapped for SSR
// and privacy modes where localStorage throws.
const getHint = () => {
  try {
    return globalThis.localStorage?.getItem(HINT_KEY) === "1";
  } catch {
    return false;
  }
};
/** @param {boolean} on */
const setHint = (on) => {
  try {
    if (on) globalThis.localStorage?.setItem(HINT_KEY, "1");
    else globalThis.localStorage?.removeItem(HINT_KEY);
  } catch {
    /* ignore */
  }
};

const isStale = () => !accessToken || Date.now() > expiresAt - STALE_SKEW_MS;

/**
 * Decode a JWT payload. UTF-8 aware, since names and department carry Turkish
 * characters. UI-only: authorization is always enforced by the backend.
 * @param {string} token
 * @returns {Record<string, *> | null}
 */
function decodeClaims(token) {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

async function doRefresh() {
  const run = async () => {
    const had = accessToken !== "";
    let res;
    try {
      res = await fetch(`${API}/auth/refresh`, { method: "POST", credentials: "include" });
    } catch {
      // Network/CORS failure: keep the hint so a later attempt retries.
      return false;
    }
    if (!res.ok) {
      accessToken = "";
      expiresAt = 0;
      // 401 = no session (expired, revoked, or reuse-detection wiped the
      // family): clear the hint so future visits stay silent.
      if (res.status === 401) {
        setHint(false);
        if (had) emit();
      }
      return false;
    }
    const body = await res.json();
    accessToken = body.accessToken ?? "";
    expiresAt = Date.now() + (Number(body.expiresInSeconds) || 0) * 1000;
    setHint(accessToken !== "");
    if (!had && accessToken) emit();
    return accessToken !== "";
  };
  return typeof navigator !== "undefined" && "locks" in navigator
    ? navigator.locks.request(LOCK, run)
    : run();
}

const refresh = () =>
  (inflight ??= doRefresh().finally(() => {
    inflight = null;
  }));

function stripCallbackParam() {
  const url = new URL(window.location.href);
  url.searchParams.delete(CALLBACK_PARAM);
  window.history.replaceState(null, "", url.toString());
}

// Cross-tab sync rides the hint key: a login/logout in another tab flips it and
// `storage` fires here (only in OTHER tabs), so this tab re-derives its session
// without polling.
function watchStorage() {
  if (typeof window === "undefined") return null;
  /** @param {StorageEvent} e */
  const onStorage = (e) => {
    if (e.key !== HINT_KEY) return;
    if (e.newValue === null) {
      accessToken = "";
      expiresAt = 0;
      emit();
    } else if (e.newValue === "1" && !accessToken) {
      void refresh(); // emits on the sign-in transition
    }
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

export const authClient = {
  /**
   * A fresh access token, or "" for anonymous. Never hits the network for a
   * visitor with no session hint. Call this at request time (it re-refreshes a
   * stale token) rather than caching the string.
   * @returns {Promise<string>}
   */
  async getAccessToken() {
    if (!isStale()) return accessToken;
    if (!accessToken && !getHint()) return "";
    return (await refresh()) ? accessToken : "";
  },

  /** Decoded payload of the held token, for UI decisions only. */
  claims: () => (accessToken ? decodeClaims(accessToken) : null),

  isAuthenticated: () => accessToken !== "",
  hasSessionHint: getHint,

  /**
   * Full-page redirect into the backend's login flow. Comes back to `returnTo`
   * (default: the current URL) carrying `?auth=callback`, which `bootstrap`
   * turns into the token exchange.
   * @param {string} [returnTo]
   */
  signIn(returnTo) {
    if (typeof window === "undefined") return;
    const back = new URL(returnTo ?? window.location.href);
    back.searchParams.set(CALLBACK_PARAM, CALLBACK_VALUE);
    window.location.href = `${API}/auth/login?redirectUri=${encodeURIComponent(back.toString())}`;
  },

  async signOut() {
    try {
      await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" });
    } catch {
      // Backend unreachable: still drop local state; the cookies die with their
      // TTL and the session stays revocable server-side.
    }
    accessToken = "";
    expiresAt = 0;
    setHint(false);
    emit();
  },

  /**
   * Mount probe: exchange the cookie for a token when we just came back from
   * login (`?auth=callback`) or a hint says a session may exist. Anonymous
   * visitors (neither) make no network call.
   * @returns {Promise<boolean>} whether a session resolved.
   */
  async bootstrap() {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    const returning = params.get(CALLBACK_PARAM) === CALLBACK_VALUE;
    if (returning) stripCallbackParam();
    if (!returning && !getHint()) return false;
    return refresh();
  },

  /**
   * Subscribe to auth transitions (sign-in / sign-out, this tab or another).
   * Token renewals for the same session do not fire. Returns an unsubscribe.
   * @param {() => void} cb
   */
  onChange(cb) {
    listeners.add(cb);
    if (listeners.size === 1) unwatch = watchStorage();
    return () => {
      listeners.delete(cb);
      if (listeners.size === 0 && unwatch) {
        unwatch();
        unwatch = null;
      }
    };
  },
};
