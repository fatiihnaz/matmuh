"use client";

// Global client providers. Passthrough for now: the auth session provider
// re-attaches here once the new auth layer lands.
export function Providers({ children }) {
  return <>{children}</>;
}
