import { CONTENT_CATEGORIES } from "@/data/content-shape";

export default function CategoryTags({ ids = [] }) {
  return ids.map((id) => {
    const category = CONTENT_CATEGORIES.find((c) => c.id === id);
    if (!category) return null;
    return (
      <span
        key={id}
        className="inline-block px-1.5 py-0.5 rounded bg-primary-500/6 text-[10px] font-medium text-primary-500/50"
      >
        {category.label}
      </span>
    );
  });
}
