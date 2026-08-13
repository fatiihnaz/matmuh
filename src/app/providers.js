"use client";

import { AuthProvider } from "@/lib/auth";

// App-wide client providers. Auth wraps everything (the CMS is one consumer;
// student flows read the same session), and the tree stays server-rendered
// because children pass straight through.
export function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
