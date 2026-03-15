"use client";

import { SessionProvider } from "next-auth/react";
import { ContentProvider } from "@/lib/context/ContentContext";

export function Providers({ children }) {
  return (
    <SessionProvider>
      <ContentProvider>
        {children}
      </ContentProvider>
    </SessionProvider>
  );
}