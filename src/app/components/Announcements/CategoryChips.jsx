import Link from "next/link";

function Chip({ href, active, children, count }) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium whitespace-nowrap transition-colors ${
        active
          ? "bg-secondary-500/12 border-secondary-500/20 text-secondary-700"
          : "border-transparent text-primary-500/70 hover:bg-primary-500/4 hover:text-primary-500/70"
      }`}
    >
      {children}
      {count != null && <span className="text-[10px] opacity-60">{count}</span>}
    </Link>
  );
}

export default function CategoryChips({
  categories,
  active,
  basePath = "/duyurular",
  showCounts = false,
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar -mx-1 px-1 lg:overflow-visible lg:flex-wrap lg:mx-0 lg:px-0">
      <Chip href={basePath} active={!active}>
        Tümü
      </Chip>
      {categories.map((category) => (
        <Chip
          key={category.id}
          href={`${basePath}?kategori=${category.id}`}
          active={active === category.id}
          count={showCounts ? category.count : null}
        >
          {category.label}
        </Chip>
      ))}
    </div>
  );
}
