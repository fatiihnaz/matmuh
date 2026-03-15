"use client";

import { Megaphone, Newspaper, FileText, Presentation } from "lucide-react";
import { useContentState, useContentDispatch } from "@/lib/hooks/useContent";

const iconMap = {
  megaphone: Megaphone,
  newspaper: Newspaper,
  "file-text": FileText,
  presentation: Presentation,
};

export default function ContentTypeList() {
  const { contentTypes, contentsByType } = useContentState();
  const { selectType } = useContentDispatch();

  return (
    <div className="p-3 space-y-1">
      <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold px-2 pb-2">
        İçerik Tipleri
      </p>
      {contentTypes.map((ct) => {
        const Icon = iconMap[ct.icon] || FileText;
        const count = contentsByType[ct.slug]?.length || 0;

        return (
          <button key={ct.id} onClick={() => selectType(ct.slug)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-secondary-500/10 transition-colors">
              <Icon size={16} className="text-secondary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/90 font-medium truncate">
                {ct.name}
              </p>
              <p className="text-[11px] text-white/30 truncate">
                {ct.description}
              </p>
            </div>
            <span className="text-[11px] text-white/20 bg-white/5 px-2 py-0.5 rounded-md">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}