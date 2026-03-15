"use client";

import { motion } from "framer-motion";
import { useContentState } from "@/lib/hooks/useContent";
import AdminPanel, { PANEL_WIDTH } from "./AdminPanel";

const transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export default function AdminLayout({ children }) {
  const { canManageContent, isPanelOpen } = useContentState();

  if (!canManageContent) {
    return <>{children}</>;
  }

  return (
    <>
      <AdminPanel />
      <motion.div className="flex flex-col min-h-screen" animate={{ paddingLeft: isPanelOpen ? PANEL_WIDTH : 0 }} transition={transition}>
        {children}
      </motion.div>
    </>
  );
}
