"use client";

import { useState } from "react";
import { Save, Eye, EyeOff, RotateCcw, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useContentState, useContentDispatch } from "@/lib/hooks/useContent";

const SECTION_LABELS = { // Will be dynamic
  keyMetrics: "Temel Göstergeler",
  academicStats: "Sayılarla Bölüm",
  workingAreas: "Çalışma Alanları",
  milestones: "Kilometre Taşları",
  missionVision: "Misyon & Vizyon",
};

const FIELD_CONFIG = { // Will be dynamic
  keyMetrics: [
    { key: "value", label: "Değer", placeholder: "1976" },
    { key: "label", label: "Başlık", placeholder: "Kuruluş" },
    { key: "sub", label: "Alt Başlık", placeholder: "Matematik Müh." },
  ],
  academicStats: [
    { key: "value", label: "Değer", placeholder: "27" },
    { key: "label", label: "Başlık", placeholder: "Öğretim Üyesi" },
  ],
  workingAreas: [
    { key: "label", label: "Alan Adı", placeholder: "Veri Bilimi" },
    { key: "icon", label: "İkon", placeholder: "BarChart3" },
    { key: "size", label: "Boyut", placeholder: "lg / md / sm" },
  ],
  milestones: [
    { key: "year", label: "Yıl", placeholder: "1982" },
    { key: "event", label: "Olay", placeholder: "..." },
  ],
};

function CollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-white/5 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-white/60 hover:text-white/80 bg-white/3 transition-colors">
        <span>{title}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="overflow-hidden"
            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }}
          >
            <div className="p-2.5 space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArraySection({ slug, metaKey, items, dispatch }) {
  const fields = FIELD_CONFIG[metaKey];
  if (!fields || !Array.isArray(items)) return null;

  return (
    <>
      {items.map((item, i) => (
        <div key={item.id || i} className="bg-white/3 rounded-lg p-2 space-y-1.5">
          <span className="text-[9px] text-white/20 font-mono">{item.id || `#${i}`}</span>
          {fields.map((f) => (
            <div key={f.key} className="flex items-center gap-2">
              <label className="text-[10px] text-white/25 w-14 shrink-0 text-right">
                {f.label}
              </label>
              <input type="text" value={String(item[f.key] ?? "")} onChange={(e) => dispatch({ type: "UPDATE_METADATA_ITEM", payload: { slug, metaKey, itemIndex: i, field: f.key, value: e.target.value } })} placeholder={f.placeholder}
                className="flex-1 bg-white/5 text-white/70 text-xs px-2 py-1 rounded border border-white/10 focus:outline-none focus:border-secondary-500/40 transition-colors placeholder:text-white/10"
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function ObjectSection({ slug, metaKey, obj, dispatch }) {
  if (!obj || typeof obj !== "object") return null;

  return (
    <>
      {Object.entries(obj).map(([field, value]) => (
        <div key={field} className="space-y-1">
          <label className="text-[10px] text-white/30 capitalize">{field}</label>
          <textarea value={String(value)} onChange={(e) => dispatch({ type: "UPDATE_METADATA_OBJECT_FIELD", payload: { slug, metaKey, field, value: e.target.value }})} rows={3}
            className="w-full bg-white/5 text-white/70 text-xs px-2.5 py-2 rounded border border-white/10 focus:outline-none focus:border-secondary-500/40 transition-colors resize-y leading-relaxed"
          />
        </div>
      ))}
    </>
  );
}

export default function ContentEditor() {
  const { selectedContentId, contentBySlug, dirtyContentSlugs } =
    useContentState();
  const { updateField, dispatch } = useContentDispatch();

  const content = Object.values(contentBySlug).find(
    (c) => c.id === selectedContentId
  );

  if (!content) {
    return (
      <div className="p-4 text-white/30 text-sm text-center">
        İçerik bulunamadı
      </div>
    );
  }

  const isDirty = dirtyContentSlugs.has(content.slug);

  const handleSave = () => {
    dispatch({ type: "SAVE_SUCCESS", payload: content }); // TODO: Replace with API call when backend is ready
  };

  const handleDiscard = () => {
    dispatch({ type: "MARK_CLEAN", payload: content.slug });
  };

  const metadataEntries = Object.entries(content.metadata || {});

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">
            Başlık
          </label>
          <input type="text" value={content.title} onChange={(e) => updateField(content.slug, "title", e.target.value)}
            className="w-full bg-white/5 text-white text-sm px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-secondary-500/40 transition-colors"
          />
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            {content.isPublished ? (
              <Eye size={14} className="text-emerald-400" />
            ) : (
              <EyeOff size={14} className="text-white/30" />
            )}
            <span className="text-xs text-white/60">
              {content.isPublished ? "Yayında" : "Taslak"}
            </span>
          </div>
          <button onClick={() => updateField(content.slug, "isPublished", !content.isPublished)} className={`relative w-9 h-5 rounded-full transition-colors ${content.isPublished ? "bg-emerald-500" : "bg-white/10"}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${content.isPublished ? "left-4.5" : "left-0.5"}`}/>
          </button>
        </div>

        {metadataEntries.length > 0 && (
          <div className="space-y-2 pt-1">
            <label className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">
              Sayfa Verileri
            </label>

            {metadataEntries.map(([key, value]) => {
              const sectionTitle = SECTION_LABELS[key] || key;
              const isArray = Array.isArray(value);
              const isObject = !isArray && typeof value === "object" && value !== null;

              if (!isArray && !isObject) return null;

              return (
                <CollapsibleSection key={key} title={sectionTitle}>
                  {isArray ? (
                    <ArraySection slug={content.slug} metaKey={key} items={value} dispatch={dispatch} />
                  ) : (
                    <ObjectSection slug={content.slug} metaKey={key} obj={value} dispatch={dispatch} />
                  )}
                </CollapsibleSection>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10 space-y-2">
        <button onClick={handleSave} disabled={!isDirty}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-medium transition-colors bg-secondary-500 text-primary-700 hover:bg-secondary-400 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Save size={14} />
          Kaydet
        </button>

        {isDirty && (
          <button onClick={handleDiscard} className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs text-white/40 hover:text-white/60 border border-white/10 hover:border-white/20 transition-colors">
            <RotateCcw size={14} />
            Değişiklikleri İptal Et
          </button>
        )}
      </div>
    </div>
  );
}