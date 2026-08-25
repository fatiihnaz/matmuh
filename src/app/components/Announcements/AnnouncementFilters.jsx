"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";

export default function AnnouncementFilters({ placeholder = "Duyurularda ara..." }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("q") ?? "";
  const [value, setValue] = useState(current);
  const [syncedWith, setSyncedWith] = useState(current);

  if (current !== syncedWith) {
    setSyncedWith(current);
    setValue(current);
  }

  useEffect(() => {
    if (value === current) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (value) params.set("q", value);
      else params.delete("q");
      params.delete("sayfa");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [value, current, pathname, router, searchParams]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search
        size={14}
        strokeWidth={1.5}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500/70"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full pl-9 pr-8 py-2 text-[13px] text-primary-500 rounded-lg bg-primary-500/3 border border-primary-500/8 outline-none focus:border-secondary-500/40 transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Aramayı temizle"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary-500/70 hover:text-primary-500/70 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
