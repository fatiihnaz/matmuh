"use client";

import { useMemo } from "react";
import { useContentState } from "@/lib/hooks/useContent";

export function useEditableContent(slug) {
  const { contentBySlug, isPanelOpen, canManageContent, selectedContentId } =
    useContentState();

  const content = contentBySlug[slug] || null;

  const isEditing =
    canManageContent &&
    isPanelOpen &&
    content &&
    selectedContentId === content.id;

  const getFieldValue = useMemo(() => {
    if (!content) return () => undefined;

    return (path) => {
      const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
      let current = content;
      for (const key of keys) {
        if (current == null) return undefined;
        current = current[key];
      }
      return current;
    };
  }, [content]);

  return { content, isEditing, getFieldValue };
}