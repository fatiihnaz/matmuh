import Link from "next/link";
import { CalendarCheck, GraduationCap, Briefcase, Sparkles, Layers, LayoutGrid } from "lucide-react";

const ICONS = {
  sinav: CalendarCheck,
  mezuniyet: GraduationCap,
  staj: Briefcase,
  kariyer: Sparkles,
  genel: Layers,
};

function Chip({ href, active, icon: Icon, children, count }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
        active
          ? "bg-secondary-500/12 border-secondary-500/20 text-secondary-600"
          : "border-transparent text-primary-500/45 hover:bg-primary-500/4 hover:text-primary-500/70"
      }`}
    >
      <Icon className="size-3.5" />
      {children}
      {count != null && <span className="text-[10px] opacity-60">{count}</span>}
    </Link>
  );
}

export default function CategoryChips({ categories, active, basePath = "/duyurular", showCounts = false }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      <Chip href={basePath} active={!active} icon={LayoutGrid}>
        Tümü
      </Chip>
      {categories.map((category) => (
        <Chip
          key={category.id}
          href={`${basePath}?kategori=${category.id}`}
          active={active === category.id}
          icon={ICONS[category.id] ?? Layers}
          count={showCounts ? category.count : null}
        >
          {category.label}
        </Chip>
      ))}
    </div>
  );
}
