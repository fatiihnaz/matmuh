"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import StaffMember from "./StaffMember";
import PageLayout from "@/app/components/PageLayout";
import { staffData } from "@/data/staff";

const categories = [
  { id: "yonetim", dataKey: "management", label: "Yönetim", sub: "Bölüm Başkanlığı ve Yönetim Kurulu" },
  { id: "akademik", dataKey: "academics", label: "Akademik Kadro", sub: "Profesör, Doçent ve Doktor Öğretim Üyeleri" },
  { id: "arastirma", dataKey: "researchAssistants", label: "Öğretim & Araştırma Gör.", sub: "Araştırma Görevlileri ve Öğretim Görevlileri" },
  { id: "idari", dataKey: "administrative", label: "İdari Personel", sub: "İdari ve Teknik Kadro" },
];

const academicRanks = ["Tümü", "Prof. Dr.", "Doç. Dr.", "Dr. Öğr. Üyesi"];
const researchRanks = ["Tümü", "Arş. Gör.", "Öğr. Gör."];
const bgColors = ["#1D2445", "#2a3158", "#33295a", "#1a3348", "#2d3a2e", "#3a2d2d", "#2a2d45"];

function StaffContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("type") || "akademik";

  const [rankFilter, setRankFilter] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setRankFilter("Tümü");
    setSearchQuery("");
  }, [categoryParam]);

  const activeCategory = useMemo(() =>
    categories.find(c => c.id === categoryParam) || categories[1],
    [categoryParam]
  );

  const availableRanks = useMemo(() => {
    if (categoryParam === "akademik") return academicRanks;
    if (categoryParam === "arastirma") return researchRanks;
    return [];
  }, [categoryParam]);

  const filteredStaff = useMemo(() => {
    const list = staffData[activeCategory.dataKey] || [];
    return list.filter((member) => {
      const isFilterable = availableRanks.length > 0;
      const matchesRank =
        !isFilterable ||
        rankFilter === "Tümü" ||
        (rankFilter === "Arş. Gör."
          ? member.rank.includes("Arş.") || member.rank.includes("Araş.")
          : member.rank.includes(rankFilter));

      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRank && matchesSearch;
    });
  }, [activeCategory, rankFilter, searchQuery, availableRanks]);

  return (
    <>
      <div
        className="rounded-xl p-4 mb-6 flex flex-col lg:flex-row items-start lg:items-center gap-6"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div className="relative flex-1 w-full sm:max-w-xs">
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

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium mr-1" style={{ color: "rgba(29,36,69,0.4)" }}>
            Kategori:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => router.push(`/personel?type=${cat.id}`)}
              className="px-2.5 py-1 rounded-md transition-all duration-200 text-xs font-medium border"
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
          <div className="flex items-center gap-1.5 flex-wrap lg:border-l lg:pl-6 lg:border-black/5">
            <span className="text-xs font-medium mr-1" style={{ color: "rgba(29,36,69,0.4)" }}>
              Unvan:
            </span>
            {availableRanks.map((r) => (
              <button
                key={r}
                onClick={() => setRankFilter(r)}
                className="px-2.5 py-1 rounded-md transition-all duration-200 text-xs font-medium border"
                style={{
                  backgroundColor: rankFilter === r ? "rgba(29,36,69,0.08)" : "transparent",
                  color: rankFilter === r ? "#1D2445" : "rgba(29,36,69,0.45)",
                  borderColor: rankFilter === r ? "rgba(29,36,69,0.1)" : "transparent",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between px-1">
        <span className="text-xs text-primary-500/40">
          {filteredStaff.length} sonuç gösteriliyor
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStaff.map((member, idx) => (
          <StaffMember key={member.id || member.email} member={member} idx={idx} bgColors={bgColors} />
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-20 text-sm text-primary-500/40 font-medium border border-dashed border-primary-500/10 rounded-2xl">
          Kriterlere uygun personel bulunamadı.
        </div>
      )}
    </>
  );
}

export default function StaffPage() {
  return (
    <PageLayout>
      <Suspense fallback={<div className="py-20 text-center text-xs text-primary-500/40">Yükleniyor...</div>}>
        <StaffContent />
      </Suspense>
    </PageLayout>
  );
}