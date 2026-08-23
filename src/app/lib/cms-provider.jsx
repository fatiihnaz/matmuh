"use client";

import { useCallback, useMemo } from "react";
import { CmsProvider } from "inscribed";

import { useAuth } from "@/lib/auth";

/**
 * @file Plugs our auth layer into inscribed's consumer-auth seams.
 *
 * `isAdmin` is derived from the live in-memory token, not a server cookie: the
 * access_token cookie is 15-min and unreadable cross-origin in dev, so relying
 * on it server-side would drop the drawer. The token is refreshed by the auth
 * client, so the drawer mounts as soon as an editor's session resolves after
 * hydration. Injecting `isAdmin` only decides whether the editing UI shows;
 * authorization stays the backend's (writes carry the Bearer, 403 otherwise).
 */

const EDIT_ROLES = ["ROLE_ADMIN", "ROLE_EDITOR"];

export function useIsEditor() {
  const { user } = useAuth();
  return !!user?.authorities?.some((role) => EDIT_ROLES.includes(role));
}

export function AppCmsProvider(props) {
  const { user, getAccessToken, signOut } = useAuth();

  const isAdmin = !!user?.authorities?.some((role) => EDIT_ROLES.includes(role));

  const userInfo = useMemo(
    () => (user ? { name: user.name, email: user.email, image: null } : null),
    [user],
  );

  const onSignOut = useCallback(() => void signOut(), [signOut]);

  return (
    <CmsProvider
      {...props}
      isAdmin={isAdmin}
      getAccessToken={getAccessToken}
      userInfo={userInfo}
      onSignOut={onSignOut}
    />
  );
}
