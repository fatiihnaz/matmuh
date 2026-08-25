"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";

import StaffMember from "./StaffMember";
import PageLayout from "@/app/components/PageLayout";
import { SkeletonBlock, SkeletonLine } from "@/app/components/Skeleton";
import { fullName, useStaff } from "@/app/components/PersonRow";
import { useLocaleNav } from "@/i18n/useLocaleNav";

const categories = [
  { id: "yonetim", group: "MANAGEMENT", label: "Yönetim" },
  { id: "akademik", group: "ACADEMIC", label: "Akademik Kadro" },
  { id: "arastirma", group: "TEACHING_AND_RESEARCH", label: "Öğretim & Araştırma Gör." },
  { id: "idari", group: "ADMINISTRATIVE", label: "İdari Personel" },
];

const academicRanks = ["Tümü", "Prof. Dr.", "Doç. Dr.", "Dr. Öğr. Üyesi"];
const researchRanks = ["Tümü", "Arş. Gör.", "Öğr. Gör."];

function StaffCardSkeleton() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-primary-500/10 bg-white p-5 shadow-xs">
      <SkeletonBlock className="mb-3 size-16 rounded-full" />
      <SkeletonLine className="w-3/4" />
      <SkeletonLine className="mt-2 w-1/2" />
      <SkeletonLine className="mt-3 w-2/3" />
    </div>
  );
}

function StaffSkeleton() {
  return (
    <>
      <div className="mb-6 flex flex-col items-stretch gap-4 rounded-xl border border-black/6 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:gap-6">
        <SkeletonBlock className="h-9 w-full shrink-0 sm:max-w-xs lg:w-72" />
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 4 }, (_, i) => (
              <SkeletonBlock key={i} className="h-6 w-24" />
            ))}
          </div>
          <SkeletonBlock className="h-6 w-40" />
        </div>
      </div>

      <div className="mb-4 px-1">
        <SkeletonLine className="w-32" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <StaffCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

function StaffContent({ initialStaff }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { href } = useLocaleNav();
  const categoryParam = searchParams.get("type") || "akademik";

  const [rankFilter, setRankFilter] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");

  const { people: roster, isLoading, error } = useStaff(initialStaff);

  const [seenCategory, setSeenCategory] = useState(categoryParam);
  if (seenCategory !== categoryParam) {
    setSeenCategory(categoryParam);
    setRankFilter("Tümü");
    setSearchQuery("");
  }

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === categoryParam) || categories[1],
    [categoryParam],
  );

  const availableRanks = useMemo(() => {
    if (categoryParam === "akademik") return academicRanks;
    if (categoryParam === "arastirma") return researchRanks;
    return [];
  }, [categoryParam]);

  const filteredStaff = useMemo(() => {
    const query = searchQuery.toLocaleLowerCase("tr");
    return roster.filter((member) => {
      if (!member.groups?.includes(activeCategory.group)) return false;

      const title = member.academicTitle ?? "";
      const isFilterable = availableRanks.length > 0;
      const matchesRank =
        !isFilterable ||
        rankFilter === "Tümü" ||
        (rankFilter === "Arş. Gör."
          ? title.includes("Arş.") || title.includes("Araş.")
          : title.includes(rankFilter));

      const matchesSearch = fullName(member).toLocaleLowerCase("tr").includes(query);
      return matchesRank && matchesSearch;
    });
  }, [roster, activeCategory, rankFilter, searchQuery, availableRanks]);

  return (
    <>
      <div
        className="rounded-xl p-4 mb-6 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-6"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div className="relative w-full shrink-0 sm:max-w-xs lg:w-72">
          <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(29,36,69,0.3)" }} />
          <input
            type="text"
            placeholder="İsim ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg outline-none transition-all duration-200 focus:ring-1"
            style={{
              fontSize: "0.8125rem",
              backgroundColor: "rgba(29,36,69,0.03)",
              border: "1px solid rgba(0,0,0,0.06)",
              color: "#1D2445",
            }}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span className="hidden shrink-0 text-xs font-medium mr-1 lg:inline" style={{ color: "rgba(29,36,69,0.4)" }}>
            Kategori:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => router.push(href(`/personel?type=${cat.id}`))}
              className="whitespace-nowrap px-2.5 py-1 rounded-md transition-all duration-200 text-xs font-medium border"
              style={{
                backgroundColor: categoryParam === cat.id ? "rgba(173,151,111,0.12)" : "transparent",
                color: categoryParam === cat.id ? "#AD976F" : "rgba(29,36,69,0.45)",
                borderColor: categoryParam === cat.id ? "rgba(173,151,111,0.2)" : "transparent",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {availableRanks.length > 0 && (
        <div className="flex shrink-0 items-center gap-2">
          <span className="shrink-0 text-xs font-medium" style={{ color: "rgba(29,36,69,0.4)" }}>
            Unvan:
          </span>
          <div className="relative">
            <select
              value={rankFilter}
              onChange={(e) => setRankFilter(e.target.value)}
              aria-label="Unvana göre süz"
              className="w-40 appearance-none rounded-md border py-1 pl-2.5 pr-7 text-xs font-medium outline-none transition-colors"
              style={{
                backgroundColor: rankFilter === "Tümü" ? "transparent" : "rgba(29,36,69,0.08)",
                color: rankFilter === "Tümü" ? "rgba(29,36,69,0.45)" : "#1D2445",
                borderColor: "rgba(0,0,0,0.08)",
              }}
            >
              {availableRanks.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              strokeWidth={1.5}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
              style={{ color: "rgba(29,36,69,0.35)" }}
            />
          </div>
        </div>
        )}

        </div>
      </div>

      <div className="mb-4 flex items-center justify-between px-1">
        <span className="text-xs text-primary-500/70">
          {filteredStaff.length} sonuç gösteriliyor
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading && filteredStaff.length === 0
          ? Array.from({ length: 8 }, (_, i) => <StaffCardSkeleton key={i} />)
          : filteredStaff.map((member, idx) => (
              <StaffMember key={member.slug} member={member} idx={idx} />
            ))}
      </div>

      {!isLoading && filteredStaff.length === 0 && (
        <div className="text-center py-20 text-sm text-primary-500/70 font-medium border border-dashed border-primary-500/10 rounded-xl">
          {error ? "Personel listesi yüklenemedi." : "Kriterlere uygun personel bulunamadı."}
        </div>
      )}
    </>
  );
}

export default function StaffPage({ initialStaff = [] }) {
  return (
    <PageLayout>
      <Suspense fallback={<StaffSkeleton />}>
        <StaffContent initialStaff={initialStaff} />
      </Suspense>
    </PageLayout>
  );
}
