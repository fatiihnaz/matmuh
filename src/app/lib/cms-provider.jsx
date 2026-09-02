"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { CmsProvider } from "inscribed";

import { useAuth } from "@/lib/auth";
import { useWideViewport } from "./useWideViewport";

/**
 * @file Plugs our auth layer into inscribed's consumer-auth seams.
 *
 * `isAdmin` is derived from the live in-memory token, not a server cookie: the
 * access_token cookie is 15-min and unreadable cross-origin in dev, so relying
 * on it server-side would drop the drawer. The token is refreshed by the auth
 * client, so the drawer mounts as soon as an editor's session resolves after
 * hydration. Injecting `isAdmin` only decides whether the editing UI shows;
 * authorization stays the backend's (writes carry the Bearer, 403 otherwise).
 *
 * An editor can switch the editing UI off from the profile menu to read the
 * site as a visitor. The preference is per-browser and never widens access:
 * it can only turn `isAdmin` off, never on.
 */

const EDIT_ROLES = ["ROLE_ADMIN", "ROLE_EDITOR"];
const STORAGE_KEY = "mm-cms-editing";

const DEV_FORCE_ADMIN =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_CMS_FAKE_ADMIN === "1";

const listeners = new Set();

function storage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener("storage", notify);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", notify);
  };
}

const getSnapshot = () => storage()?.getItem(STORAGE_KEY) !== "0";
const getServerSnapshot = () => true;

const EditingContext = createContext({
  canEdit: false,
  editing: true,
  setEditing: () => {},
  openPanel: () => {},
});

export function useCmsEditing() {
  return useContext(EditingContext);
}

export function useIsEditor() {
  const { canEdit, editing } = useCmsEditing();
  const wide = useWideViewport();
  return canEdit && editing && wide;
}

export function AppCmsProvider({ panels, ...props }) {
  const { user, getAccessToken, signOut } = useAuth();
  const editing = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const wide = useWideViewport();

  const canEdit =
    DEV_FORCE_ADMIN || !!user?.authorities?.some((role) => EDIT_ROLES.includes(role));

  // A panel's `requiresRole` is ours, not inscribed's: the drawer mounts for
  // every editor, so an area only some of them may open has to be dropped
  // before it becomes a rail button that opens a 403.
  const allowedPanels = useMemo(() => {
    const kept = (panels ?? []).filter(
      (panel) =>
        !panel.requiresRole ||
        DEV_FORCE_ADMIN ||
        user?.authorities?.includes(panel.requiresRole),
    );
    return kept.length ? kept : undefined;
  }, [panels, user]);

  const openPanel = useCallback((panelLabel) => {
    const handle = document.querySelector(".inscribed-handle");
    const select = () =>
      document
        .querySelector(`.inscribed-rail-btn[aria-label="${panelLabel}"]`)
        ?.click();

    if (handle?.getAttribute("aria-expanded") === "true") {
      select();
      return;
    }

    handle?.click();
    requestAnimationFrame(select);
  }, []);

  const setEditing = useCallback((next) => {
    storage()?.setItem(STORAGE_KEY, next ? "1" : "0");
    notify();
  }, []);

  const editingValue = useMemo(
    () => ({ canEdit, editing, setEditing, openPanel }),
    [canEdit, editing, setEditing, openPanel],
  );

  const userInfo = useMemo(
    () => (user ? { name: user.name, email: user.email, image: null } : null),
    [user],
  );

  const onSignOut = useCallback(() => void signOut(), [signOut]);

  return (
    <EditingContext.Provider value={editingValue}>
      <CmsProvider
        {...props}
        panels={allowedPanels}
        isAdmin={canEdit && editing && wide}
        getAccessToken={getAccessToken}
        userInfo={userInfo}
        onSignOut={onSignOut}
      />
    </EditingContext.Provider>
  );
}
