"use client";

import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const user = session?.user ?? null;
  const authorities = user?.authorities ?? [];

  return {
    user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isAdmin: authorities.includes("ROLE_USER"), // Temporary for debug
    isEditor: authorities.includes("ROLE_EDITOR"),
    login() {
      window.location.href = process.env.NEXT_PUBLIC_OAUTH_URL;
    },
    async logout() {
      await nextAuthSignOut({ callbackUrl: "/" });
    },
  };
}