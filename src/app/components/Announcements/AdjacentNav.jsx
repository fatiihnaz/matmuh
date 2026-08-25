import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

function Card({ item, label, direction }) {
  if (!item) return <div className="hidden sm:block" />;
  const forward = direction === "forward";

  return (
    <Link
      href={`/duyurular/${item.slug}`}
      className={`group flex items-center gap-3 p-4 rounded-xl bg-white border border-primary-500/10 shadow-xs hover:border-secondary-500/30 transition-colors ${
        forward ? "sm:flex-row-reverse sm:text-right" : ""
      }`}
    >
      {forward ? (
        <ArrowRight className="size-4 shrink-0 text-primary-500/70 group-hover:text-secondary-700 transition-colors" />
      ) : (
        <ArrowLeft className="size-4 shrink-0 text-primary-500/70 group-hover:text-secondary-700 transition-colors" />
      )}
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-widest text-primary-500/70">
          {label}
        </span>
        <span className="block mt-0.5 text-[13px] text-primary-500 line-clamp-2 group-hover:text-secondary-700 transition-colors">
          {item.title}
        </span>
      </span>
    </Link>
  );
}

export default function AdjacentNav({ older, newer }) {
  if (!older && !newer) return null;
  return (
    <nav aria-label="Önceki ve sonraki duyuru" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Card item={older} label="Önceki duyuru" direction="back" />
      <Card item={newer} label="Sonraki duyuru" direction="forward" />
    </nav>
  );
}
