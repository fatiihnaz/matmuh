"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useContentState, useContentDispatch } from "@/lib/hooks/useContent";

export default function ContentList() {
  const { selectedTypeSlug, contentsByType, contentTypes } = useContentState();
  const { selectContent } = useContentDispatch();
  const [search, setSearch] = useState("");

  const contents = contentsByType[selectedTypeSlug] || [];
  const type = contentTypes.find((t) => t.slug === selectedTypeSlug);

  const filtered = search ? contents.filter((c) => c.title.toLocaleLowerCase("tr-TR").includes(search.toLocaleLowerCase("tr-TR"))) : contents;

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 space-y-2">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20"/>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="İçerik ara..."
            className="w-full bg-white/5 text-white text-xs pl-8 pr-3 py-2 rounded-lg border border-white/10 placeholder:text-white/20 focus:outline-none focus:border-secondary-500/40 transition-colors"
          />
        </div>

        <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-dashed border-white/10 text-white/40 hover:text-secondary-500 hover:border-secondary-500/30 transition-colors text-xs">
          <Plus size={14} />
          Yeni {type?.name || "İçerik"}
        </button>
      </div>

      <div className="px-3 pb-3 space-y-1">
        {filtered.length === 0 && (
          <p className="text-xs text-white/20 text-center py-6">
            {search ? "Sonuç bulunamadı" : "Henüz içerik yok"}
          </p>
        )}

        {filtered.map((content) => (
          <button key={content.id} onClick={() => selectContent(content.id)} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ content.isPublished ? "bg-emerald-400" : "bg-white/20" }`}/>
              <p className="text-sm text-white/80 truncate group-hover:text-white transition-colors">
                {content.title}
              </p>
            </div>
            <p className="text-[10px] text-white/20 mt-0.5 pl-3.5">
              {content.slug}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}