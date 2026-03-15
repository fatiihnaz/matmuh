"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsLeft, ChevronRight, FilePlus } from "lucide-react";
import { useContentState, useContentDispatch } from "@/lib/hooks/useContent";
import ContentEditor from "./ContentEditor";

export const PANEL_WIDTH = 440;

const transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

function pathnameToSlug(pathname) {
  if (pathname === "/") return "anasayfa";
  return pathname.replace(/^\//, "").replace(/\/$/, "");
}

function pathnameToBreadcrumb(pathname) {
  if (pathname === "/") return [{ label: "Anasayfa", path: "/" }];

  const segments = pathname.replace(/^\//, "").replace(/\/$/, "").split("/");
  const crumbs = [{ label: "Anasayfa", path: "/" }];

  let currentPath = "";
  segments.forEach((seg) => {
    currentPath += `/${seg}`;
    const label = seg
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toLocaleUpperCase("tr-TR"));
    crumbs.push({ label, path: currentPath });
  });

  return crumbs;
}

function CreateContentPrompt({ slug, breadcrumbs, createContent }) {
  const titleInputRef = useRef(null);
  const defaultTitle = breadcrumbs[breadcrumbs.length - 1]?.label || "";

  const handleCreate = () => {
    const title = titleInputRef.current?.value?.trim() || defaultTitle;
    createContent(slug, title);
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4 py-12">
      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
        <FilePlus size={20} className="text-white/20" />
      </div>
      <p className="text-xs text-white/30 text-center">
        Bu sayfa için henüz içerik tanımlanmamış
      </p>
      <div className="w-full space-y-2">
        <input ref={titleInputRef} type="text" defaultValue={defaultTitle} placeholder="Sayfa başlığı"
          className="w-full bg-white/5 text-white text-xs px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-secondary-500/40 transition-colors placeholder:text-white/15"
        />
        <button onClick={handleCreate} className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-medium bg-secondary-500 text-primary-700 hover:bg-secondary-400 transition-colors">
          <FilePlus size={14} />
          İçerik Oluştur
        </button>
      </div>
      <span className="text-[10px] text-white/15 font-mono">{slug}</span>
    </div>
  );
}

export default function AdminPanel() {
  const state = useContentState();
  const { setPanelOpen, selectContent, selectType, createContent } = useContentDispatch();
  const { isPanelOpen, contentBySlug } = state;
  const pathname = usePathname();

  const pageSlug = pathnameToSlug(pathname);
  const pageContent = contentBySlug[pageSlug] || null;
  const breadcrumbs = pathnameToBreadcrumb(pathname);

  useEffect(() => {
    if (!isPanelOpen) return;
    if (pageContent) {
      if (pageContent.type?.slug) {
        selectType(pageContent.type.slug);
      }
      selectContent(pageContent.id);
    } else {
      selectContent(null);
    }
  }, [isPanelOpen, pathname]);

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          <motion.div className="fixed left-0 top-0 h-screen z-60"
            initial={{ x: -PANEL_WIDTH }} animate={{ x: 0 }} exit={{ x: -PANEL_WIDTH }} transition={transition}
          >
            <aside className="relative h-full bg-primary-500 text-white flex flex-col w-screen md:w-110">
              <div className="px-4 pt-3 pb-1">
                <div className="flex items-center gap-1 text-[10px]">
                  {breadcrumbs.map((crumb, i) => (
                    <span key={crumb.path} className="flex items-center gap-1">
                      {i > 0 && (
                        <ChevronRight size={10} className="text-white/15" />
                      )}
                      <span className={ i === breadcrumbs.length - 1 ? "text-secondary-500 font-medium" : "text-white/30"}>
                        {crumb.label}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-4 pb-3 border-b border-white/10">
                <h2 className="text-sm font-medium truncate">
                  {pageContent ? pageContent.title : "Sayfa İçeriği"}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto">
                {pageContent ? (
                  <ContentEditor />
                ) : (
                  <CreateContentPrompt slug={pageSlug} breadcrumbs={breadcrumbs} createContent={createContent} />
                )}
              </div>

              {state.dirtyContentSlugs.size > 0 && (
                <div className="px-4 py-2 border-t border-white/10 text-xs text-secondary-400">
                  {state.dirtyContentSlugs.size} kaydedilmemiş değişiklik
                </div>
              )}

              <button type="button" onClick={() => setPanelOpen(false)} title="Paneli kapat"
                className="group absolute right-0 top-0 translate-x-full flex w-5 h-full flex-col items-center justify-center rounded-r-md border-y border-r border-white/10 bg-primary-600 text-white/40 transition-colors hover:text-white focus:outline-none z-10"
              >
                <ChevronsLeft size={14} strokeWidth={2.5} className="opacity-60 transition-transform duration-200 group-hover:scale-110 group-hover:opacity-100"/>
              </button>
            </aside>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}