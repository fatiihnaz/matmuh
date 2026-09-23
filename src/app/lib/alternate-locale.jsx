"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AlternateLocaleContext = createContext({ paths: {}, setPaths: () => {} });

export function AlternateLocaleProvider({ children }) {
  const [paths, setPaths] = useState({});
  const value = useMemo(() => ({ paths, setPaths }), [paths]);
  return (
    <AlternateLocaleContext.Provider value={value}>{children}</AlternateLocaleContext.Provider>
  );
}

export function useAlternateLocalePaths() {
  return useContext(AlternateLocaleContext).paths;
}

export default function AlternateLocalePaths({ paths }) {
  const { setPaths } = useContext(AlternateLocaleContext);
  const serialized = JSON.stringify(paths ?? {});

  useEffect(() => {
    setPaths(JSON.parse(serialized));
    return () => setPaths({});
  }, [serialized, setPaths]);

  return null;
}
