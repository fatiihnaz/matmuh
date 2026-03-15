"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useEditableContent } from "@/lib/hooks/useEditableContent";
import { useContentDispatch, useContentState } from "@/lib/hooks/useContent";

export default function EditableRegion({ slug, field, children }) {
  const { canManageContent, isPanelOpen } = useContentState();
  const { selectContent, setPanelOpen, selectType } = useContentDispatch();
  const { content } = useEditableContent(slug);
  const [hovered, setHovered] = useState(false);

  if (!canManageContent) {
    return <>{children}</>;
  }

  const showOverlay = hovered && isPanelOpen;

  const handleClick = () => {
    if (!content) return;

    if (!isPanelOpen) {
      setPanelOpen(true);
    }

    if (content.type?.slug) {
      selectType(content.type.slug);
    }
    selectContent(content.id);
  };

  return (
    <div className="relative group" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {children}

      {showOverlay && (
        <div
          onClick={handleClick}
          className="absolute inset-0 border-2 border-dashed border-secondary-500/50 rounded-lg cursor-pointer z-10 flex items-start justify-end p-1.5 bg-secondary-500/3 transition-all"
        >
          <span className="flex items-center gap-1 bg-secondary-500 text-primary-700 text-[10px] font-medium px-2 py-1 rounded-md shadow-sm">
            <Pencil size={10} />
            Düzenle
          </span>
        </div>
      )}
    </div>
  );
}