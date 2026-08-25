"use client";

import { MotionConfig } from "framer-motion";

import { AuthProvider } from "@/lib/auth";

export function Providers({ children }) {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>{children}</AuthProvider>
    </MotionConfig>
  );
}
