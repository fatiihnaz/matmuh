import Link from "next/link";
import { ChevronRight } from "lucide-react";
import MainCard from "./MainCard";

export default function RelatedPages({ items }) {
  if (!items?.length) return null;

  return (
    <MainCard title="İlgili Sayfalar">
      <nav aria-label="İlgili sayfalar" className="flex flex-col gap-0.5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] text-primary-500 hover:bg-gray-50 transition-colors"
          >
            {item.icon && (
              <item.icon className="size-4 shrink-0 text-primary-500/70" />
            )}
            <span className="flex-1">{item.label}</span>
            <ChevronRight className="size-3.5 shrink-0 text-primary-500/20 group-hover:text-secondary-700 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </nav>
    </MainCard>
  );
}
