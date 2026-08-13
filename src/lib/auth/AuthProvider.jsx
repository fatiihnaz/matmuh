"use client";

/**
 * @file App-wide auth context. Thin React layer over `auth-client`: it holds
 * the derived `user` in state and re-derives it on every auth transition. The
 * CMS is one consumer among others (student flows read the same session/token).
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { authClient } from "./auth-client.js";

/** @type {import("react").Context<AuthValue | null>} */
const AuthContext = createContext(null);

/**
 * @typedef {Object} AuthUser
 * @property {string|null} sub
 * @property {string|null} email
 * @property {string|null} name
 * @property {string|null} firstName
 * @property {string|null} lastName
 * @property {string|null} department
 * @property {string[]} authorities
 */

/**
 * @typedef {Object} AuthValue
 * @property {AuthUser|null} user
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading      True until the mount probe settles.
 * @property {(returnTo?: string) => void} signIn
 * @property {() => Promise<void>} signOut
 * @property {() => Promise<string>} getAccessToken   Fresh bearer, or "" for anonymous.
 */

/** @returns {AuthUser|null} */
function readUser() {
  const c = authClient.claims();
  if (!c) return null;
  return {
    sub: c.sub ?? null,
    email: c.email ?? null,
    name: c.name ?? [c.firstName, c.lastName].filter(Boolean).join(" ") ?? null,
    firstName: c.firstName ?? null,
    lastName: c.lastName ?? null,
    department: c.department ?? null,
    authorities: Array.isArray(c.authorities) ? c.authorities : [],
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(/** @type {AuthUser|null} */ (null));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const sync = () => {
      if (alive) setUser(readUser());
    };
    // Subscribe before the probe so a transition it triggers isn't missed.
    const unsub = authClient.onChange(sync);
    authClient.bootstrap().finally(() => {
      if (!alive) return;
      sync();
      setIsLoading(false);
    });
    return () => {
      alive = false;
      unsub();
    };
  }, []);

  const signIn = useCallback((returnTo) => authClient.signIn(returnTo), []);
  const signOut = useCallback(() => authClient.signOut(), []);
  const getAccessToken = useCallback(() => authClient.getAccessToken(), []);

  const value = useMemo(
    () => ({ user, isAuthenticated: user != null, isLoading, signIn, signOut, getAccessToken }),
    [user, isLoading, signIn, signOut, getAccessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** @returns {AuthValue} */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx == null) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
