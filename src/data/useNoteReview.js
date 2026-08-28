"use client";

/**
 * @file Client-side data layer for note review: the listing window, its paging
 * and search, and the moderation actions. Separate from the panel that renders
 * it so the drawer's markup stays markup, and so a second surface for the same
 * queue costs a component rather than a second copy of this.
 */

import { useCallback, useEffect, useState } from "react";

import { noteErrorMessage, noteListPath, notePath, toNoteList } from "./lecture-notes";
import { useAuth } from "@/lib/auth";

export const NOTE_FILTERS = [
  { id: "pending", label: "Onay Bekleyen", status: "PENDING" },
  { id: "approved", label: "Onaylı", status: "APPROVED" },
  { id: "rejected", label: "Reddedilen", status: "REJECTED" },
  { id: "all", label: "Tümü", status: undefined },
];

/**
 * @param {{ request: (path: string, init?: RequestInit) => Promise<*>, pageSize?: number }} options
 *   `request` is the caller's way to the backend, which is `useCmsPanel()`'s for
 *   the drawer panel: it attaches the editor's credential itself, so nothing
 *   here handles a token.
 */
export function useNoteReview({ request, pageSize = 20 }) {
  const { user, isAuthenticated, isLoading: authLoading, signIn } = useAuth();
  const isAdmin = Boolean(user?.authorities?.includes("ROLE_ADMIN"));

  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [result, setResult] = useState(null);
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const load = useCallback(async () => {
    const status = NOTE_FILTERS.find((item) => item.id === filter)?.status;
    return toNoteList(await request(noteListPath({ status, search: query, page, size: pageSize })));
  }, [request, filter, query, page, pageSize]);

  // Their own requests rather than `result.totalElements`: that number is only
  // whatever window is open, while these label every filter at once and feed
  // the rail badge. `size: 1` because only the total is wanted.
  const loadCounts = useCallback(async () => {
    const entries = await Promise.all(
      NOTE_FILTERS.map(async (item) => {
        const body = await request(noteListPath({ status: item.status, page: 0, size: 1 }));
        return [item.id, toNoteList(body).totalElements];
      }),
    );
    return Object.fromEntries(entries);
  }, [request]);

  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    if (!isAdmin) return undefined;
    let alive = true;
    setError(null);
    load()
      .then((data) => alive && setResult(data))
      .catch((err) => alive && setError(noteErrorMessage(err)));
    loadCounts()
      .then((value) => alive && setCounts(value))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [isAdmin, load, loadCounts, reloadKey]);

  const act = useCallback(
    async (note, fn) => {
      setBusyId(note.id);
      setError(null);
      try {
        await fn();
        setResult(await load());
        setCounts(await loadCounts().catch(() => null));
      } catch (err) {
        setError(noteErrorMessage(err));
      } finally {
        setBusyId(null);
        setConfirmId(null);
      }
    },
    [load, loadCounts],
  );

  const onSetStatus = useCallback(
    (note, status) =>
      act(note, () =>
        request(notePath(note.id), { method: "PATCH", body: JSON.stringify({ status }) }),
      ),
    [act, request],
  );

  const onDelete = useCallback(
    (note) => act(note, () => request(notePath(note.id), { method: "DELETE" })),
    [act, request],
  );

  const submitSearch = useCallback(() => {
    setQuery(search.trim());
    setPage(0);
  }, [search]);

  const selectFilter = useCallback((id) => {
    setFilter(id);
    setPage(0);
    setSearch("");
    setQuery("");
  }, []);

  return {
    authLoading,
    isAuthenticated,
    isAdmin,
    signIn,

    filter,
    selectFilter,
    search,
    setSearch,
    submitSearch,
    query,
    page,
    setPage,

    result,
    counts,
    pendingCount: counts?.pending ?? null,
    error,
    busyId,
    confirmId,
    setConfirmId,
    reload,

    onSetStatus,
    onDelete,
  };
}
