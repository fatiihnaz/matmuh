"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/lib/auth";
import {
  enroll,
  fetchMyEnrollments,
  fetchWeeklyEntries,
  unenroll,
} from "./enrollments";

const MyScheduleContext = createContext(null);

const spanOf = (entry) => Math.max(1, entry.span || 1);

const overlaps = (a, b) =>
  a.day === b.day &&
  a.slot < b.slot + spanOf(b) &&
  b.slot < a.slot + spanOf(a);

export function MyScheduleProvider({ children }) {
  const { isAuthenticated, getAccessToken } = useAuth();
  const [state, setState] = useState({
    status: "loading",
    rows: [],
    entries: [],
  });
  const [busyId, setBusyId] = useState(null);
  const [failedId, setFailedId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setState({ status: "signed-out", rows: [], entries: [] });
      return undefined;
    }

    let alive = true;
    (async () => {
      try {
        const token = await getAccessToken();
        const rows = await fetchMyEnrollments(token);
        const entries = await fetchWeeklyEntries(
          new Set(rows.map((row) => row.offeringId)),
        );
        if (alive) setState({ status: "ready", rows, entries });
      } catch {
        if (alive) setState({ status: "error", rows: [], entries: [] });
      }
    })();

    return () => {
      alive = false;
    };
  }, [isAuthenticated, getAccessToken]);

  const run = useCallback(async (offeringId, action) => {
    setBusyId(offeringId);
    setFailedId(null);
    try {
      await action();
      return true;
    } catch {
      setFailedId(offeringId);
      return false;
    } finally {
      setBusyId(null);
    }
  }, []);

  const add = useCallback(
    (entry) =>
      run(entry.offeringId, async () => {
        const token = await getAccessToken();
        await enroll(entry.offeringId, token);
        const added = await fetchWeeklyEntries(new Set([entry.offeringId]));
        setState((current) => ({
          ...current,
          rows: [
            ...current.rows,
            {
              id: `offering-${entry.offeringId}`,
              offeringId: entry.offeringId,
              lectureCode: entry.code ?? null,
              lectureName: entry.name ?? null,
              groupNumber: entry.group ?? null,
              staffName: entry.instructor ?? null,
            },
          ],
          entries: [
            ...current.entries.filter(
              (item) => item.offeringId !== entry.offeringId,
            ),
            ...added,
          ],
        }));
      }),
    [getAccessToken, run],
  );

  const remove = useCallback(
    (offeringId) =>
      run(offeringId, async () => {
        const token = await getAccessToken();
        await unenroll(offeringId, token);
        setState((current) => ({
          ...current,
          rows: current.rows.filter((row) => row.offeringId !== offeringId),
          entries: current.entries.filter(
            (entry) => entry.offeringId !== offeringId,
          ),
        }));
      }),
    [getAccessToken, run],
  );

  const value = useMemo(() => {
    const ids = new Set(state.rows.map((row) => row.offeringId));

    return {
      status: state.status,
      rows: state.rows,
      entries: state.entries,
      busyId,
      failedId,
      isEnrolled: (offeringId) => ids.has(offeringId),
      clashOf: (entry) =>
        state.entries.find(
          (mine) =>
            mine.offeringId !== entry.offeringId && overlaps(mine, entry),
        ) ?? null,
      add,
      remove,
    };
  }, [state, busyId, failedId, add, remove]);

  return (
    <MyScheduleContext.Provider value={value}>
      {children}
    </MyScheduleContext.Provider>
  );
}

export function useMySchedule() {
  return useContext(MyScheduleContext);
}
