"use client";

import { CONTENT_CATEGORIES } from "@/data/content-shape";
import { useT } from "@/i18n/useT";

export default function CategoryTags({ ids = [] }) {
  const t = useT();
  return ids.map((id) => {
    const category = CONTENT_CATEGORIES.find((c) => c.id === id);
    if (!category) return null;
    return (
      <span
        key={id}
        className="inline-block px-1.5 py-0.5 rounded-sm bg-primary-500/6 text-[10px] font-medium text-primary-500/70"
      >
        {t(category.label)}
      </span>
    );
  });
}
