"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Target,
  Lightbulb,
  TrendingUp,
  Globe,
  BookOpen,
  Cpu,
  BarChart3,
  Shield,
  Atom,
} from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import MainCard from "@/app/components/MainCard";

const workingAreas = [
  {
    id: "veri",
    label: "Veri Bilimi",
    icon: BarChart3,
    size: "lg",
    cx: 50,
    cy: 35,
  },
  { id: "yapay", label: "Yapay Zeka", icon: Cpu, size: "lg", cx: 30, cy: 45 },
  {
    id: "opt",
    label: "Optimizasyon",
    icon: Target,
    size: "lg",
    cx: 70,
    cy: 45,
  },
  {
    id: "fin",
    label: "Finans Matematiği",
    icon: TrendingUp,
    size: "md",
    cx: 20,
    cy: 65,
  },
  {
    id: "krip",
    label: "Kriptografi",
    icon: Shield,
    size: "md",
    cx: 50,
    cy: 60,
  },
  {
    id: "stok",
    label: "Stokastik Süreçler",
    icon: Lightbulb,
    size: "md",
    cx: 35,
    cy: 25,
  },
  {
    id: "num",
    label: "Nümerik Analiz",
    icon: BookOpen,
    size: "md",
    cx: 65,
    cy: 25,
  },
  {
    id: "dif",
    label: "Diferansiyel Denklemler",
    icon: Award,
    size: "md",
    cx: 80,
    cy: 65,
  },
  {
    id: "ist",
    label: "İstatistik",
    icon: BarChart3,
    size: "md",
    cx: 85,
    cy: 35,
  },
  { id: "top", label: "Topoloji", icon: Atom, size: "sm", cx: 15, cy: 35 },
  {
    id: "ceb",
    label: "Cebirsel Geometri",
    icon: Globe,
    size: "sm",
    cx: 50,
    cy: 80,
  },
  { id: "kom", label: "Kombinatorik", icon: Atom, size: "sm", cx: 85, cy: 80 },
];

const graphLinks = [
  { source: "veri", target: "yapay" },
  { source: "veri", target: "opt" },
  { source: "veri", target: "ist" },
  { source: "veri", target: "krip" },
  { source: "yapay", target: "fin" },
  { source: "yapay", target: "stok" },
  { source: "opt", target: "num" },
  { source: "opt", target: "dif" },
  { source: "krip", target: "ceb" },
  { source: "krip", target: "kom" },
  { source: "top", target: "stok" },
  { source: "top", target: "fin" },
  { source: "ist", target: "dif" },
];

const milestones = [
  { year: "1911", event: "Kondüktör Mekteb-i Âlîsi'nin Kurulması" },
  {
    year: "1982",
    event: "Yıldız Üniversitesi Adını Alması ve Bölümün Modern Yapılanması",
  },
  {
    year: "1992",
    event: "Kimya-Metalürji Fakültesi Bünyesine Geçiş ve Akademik Genişleme",
  },
  {
    year: "2011",
    event: "Hesaplamalı Bilim ve Mühendislik Lisansüstü Programının Açılması",
  },
  {
    year: "2020",
    event:
      "MÜDEK ve EUR-ACE Uluslararası Mühendislik Akreditasyonunun Alınması",
  },
  {
    year: "2026",
    event: "YTÜ Cosmos T1 Modeli Çıkışı ve Çok Disiplinli Yapay Zeka Vizyonu",
  },
];

const keyMetrics = [
  { id: "kurulus", value: "1976", label: "Kuruluş", sub: "Matematik Müh." },
  {
    id: "deneyim",
    value: "50",
    label: "Yıllık Deneyim",
    sub: "Akademik Birikim",
  },
  {
    id: "mezun",
    value: "1892",
    label: "Lisans Mezunu",
    sub: "Güçlü Mezun Ağı",
  },
  {
    id: "doluluk",
    value: "%100",
    label: "Doluluk Oranı",
    sub: "YKS Tercih Performansı",
  },
];

const academicStats = [
  { id: "ogretimuye", value: "27", label: "Öğretim Üyesi" },
  { id: "lisansogr", value: "650+", label: "Lisans Öğrencisi" },
  { id: "ylisansogr", value: "50+", label: "Yüksek Lisans Öğrencisi" },
  { id: "arsgor", value: "6", label: "Araştırma Görevlisi" },
  { id: "laboratuvar", value: "290 m2", label: "Laboratuvar Alanı" },
  { id: "tercihendeks", value: "65.4", label: "İşveren Tercih Endeksi" },
];

function NodeGraphCanvas() {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full h-full bg-[#1D2445]" />;

  return (
    <div className="relative w-full h-full bg-[#1D2445] overflow-hidden select-none">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #AD976F 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {graphLinks.map((link, idx) => {
          const sourceNode = workingAreas.find((n) => n.id === link.source);
          const targetNode = workingAreas.find((n) => n.id === link.target);

          if (!sourceNode || !targetNode) return null;

          const isHighlighted =
            hoveredNode === link.source || hoveredNode === link.target;
          const isDimmed = hoveredNode !== null && !isHighlighted;

          return (
            <motion.line
              key={`${link.source}-${link.target}`}
              x1={`${sourceNode.cx}%`}
              y1={`${sourceNode.cy}%`}
              x2={`${targetNode.cx}%`}
              y2={`${targetNode.cy}%`}
              stroke={isHighlighted ? "#AD976F" : "rgba(173, 151, 111, 0.15)"}
              strokeWidth={isHighlighted ? 1.5 : 1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: isDimmed ? 0.05 : 1,
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                delay: idx * 0.05,
              }}
            />
          );
        })}

        {workingAreas.map((node, idx) => {
          const isHovered = hoveredNode === node.id;
          const isDimmed = hoveredNode !== null && !isHovered;
          const radius = node.size === "lg" ? 6 : node.size === "md" ? 4.5 : 3;

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              <motion.circle
                cx={`${node.cx}%`}
                cy={`${node.cy}%`}
                r={radius * 4}
                fill="rgba(173, 151, 111, 0.15)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isHovered ? 1.5 : 1,
                  opacity: isDimmed ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
              />

              <motion.circle
                cx={`${node.cx}%`}
                cy={`${node.cy}%`}
                r={radius}
                fill={isHovered ? "#FFF" : "#AD976F"}
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  opacity: isDimmed ? 0.2 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                  delay: idx * 0.05,
                }}
              />

              <motion.text
                x={`${node.cx}%`}
                y={`${node.cy}%`}
                dy={radius + 16}
                textAnchor="middle"
                fill={isHovered ? "#FFF" : "rgba(255, 255, 255, 0.6)"}
                fontSize={
                  node.size === "lg"
                    ? "12px"
                    : node.size === "md"
                    ? "10px"
                    : "9px"
                }
                fontWeight={node.size === "lg" ? "600" : "500"}
                className="font-sans pointer-events-none"
                initial={{ opacity: 0, y: -5 }}
                animate={{
                  opacity: isDimmed ? 0.1 : 1,
                  y: 0,
                }}
                transition={{ duration: 0.3, delay: 0.5 + idx * 0.05 }}
              >
                {node.label}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function DepartmentInfo() {
  return (
    <PageLayout>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8">
        {keyMetrics.map((stat) => (
          <div
            key={stat.id}
            className="flex flex-col rounded-xl p-6 bg-white border border-primary-500/10 shadow-xs shadow-black/10 transition-all duration-200 hover:-translate-y-1 hover:border-primary-500/20 hover:shadow-sm"
          >
            <div className="font-mono font-semibold text-2xl text-primary-500">
              {stat.value}
            </div>
            <div className="text-secondary-500 text-sm mt-1 font-medium">
              {stat.label}
            </div>
            <div className="text-xs text-primary-500/40 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <MainCard title="Misyon & Vizyon">
            <div className="flex flex-col md:flex-row gap-8 w-full">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="size-5 text-secondary-500" />
                  <span className="font-semibold text-[14px] text-primary-500">
                    Misyon
                  </span>
                </div>
                <p className="text-[13px] text-primary-500/60 leading-relaxed">
                  Matematiksel düşünce ve mühendislik yaklaşımını birleştirerek,
                  toplumun ve endüstrinin ihtiyaç duyduğu nitelikli bilim
                  insanları ve mühendisler yetiştirmek; evrensel bilime katkıda
                  bulunmak.
                </p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="size-5 text-secondary-500" />
                  <span className="font-semibold text-[14px] text-primary-500">
                    Vizyon
                  </span>
                </div>
                <p className="text-[13px] text-primary-500/60 leading-relaxed">
                  Matematik mühendisliği alanında ulusal ve uluslararası düzeyde
                  öncü, yenilikçi araştırmalarıyla tanınan, tercih edilen bir
                  bölüm olmak.
                </p>
              </div>
            </div>
          </MainCard>

          <MainCard title="Çalışma ve Araştırma Alanları">
            <div className="flex flex-col -mx-6 -mb-6">
              <div className="relative bg-[#1D2445] h-[340px] w-full group border-y border-primary-500/10">
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none z-10" />
                <div className="absolute inset-0 z-0">
                  <NodeGraphCanvas />
                </div>
                <div className="absolute bottom-4 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-[0.1em] bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5">
                    Grafik alanlar arası akademik bağları temsil eder
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white">
                <div className="flex flex-wrap gap-2.5">
                  {workingAreas.map((area) => {
                    const Icon = area.icon;
                    const isLarge = area.size === "lg";

                    return (
                      <div
                        key={area.label}
                        className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all duration-300 hover:shadow-md hover:border-secondary-500/30 cursor-pointer ${
                          isLarge
                            ? "bg-secondary-500/[0.03] border-secondary-500/10"
                            : "bg-transparent border-primary-500/5"
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-lg transition-colors ${
                            isLarge
                              ? "bg-secondary-500/10 text-secondary-500"
                              : "bg-primary-500/[0.03] text-primary-500/30 group-hover:text-secondary-500"
                          }`}
                        >
                          <Icon size={14} strokeWidth={isLarge ? 2 : 1.5} />
                        </div>
                        <span
                          className={`transition-colors duration-300 ${
                            isLarge
                              ? "text-primary-500 font-bold text-[13px]"
                              : "text-primary-500/60 font-semibold text-[12px] group-hover:text-primary-500"
                          }`}
                        >
                          {area.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </MainCard>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <MainCard title="Kilometre Taşları">
            <div className="relative pt-2">
              <div className="absolute left-[18px] top-2 bottom-4 w-px bg-primary-500/10" />
              <div className="flex flex-col">
                {milestones.map((item, idx) => (
                  <div
                    key={item.year}
                    className="relative flex items-start gap-4 py-3 group"
                  >
                    <div className="relative z-10 flex-shrink-0 w-9 flex justify-center">
                      <div
                        className={`w-3 h-3 rounded-full mt-1.5 transition-all duration-300 ${
                          idx === milestones.length - 1
                            ? "bg-secondary-500 ring-4 ring-secondary-500/20"
                            : "bg-primary-500/20 ring-4 ring-transparent group-hover:bg-primary-500/40"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-[14px] font-bold text-secondary-500 leading-none">
                        {item.year}
                      </div>
                      <div className="text-[13px] font-medium text-primary-500 mt-1 leading-relaxed">
                        {item.event}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MainCard>

          <MainCard title="Akreditasyon">
            <div className="flex flex-col gap-3">
              {[
                {
                  name: "MÜDEK",
                  desc: "Mühendislik Eğitim Programları Değerlendirme ve Akreditasyon Derneği",
                  active: true,
                },
                {
                  name: "EUR-ACE",
                  desc: "European Accreditation of Engineering Programmes",
                  active: true,
                },
                {
                  name: "ABET",
                  desc: "Accreditation Board for Engineering and Technology",
                  active: false,
                },
              ].map((acc) => (
                <div
                  key={acc.name}
                  className="p-4 rounded-lg flex items-start gap-3 bg-primary-500/[0.02] border border-primary-500/5"
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      acc.active ? "bg-secondary-500/10" : "bg-primary-500/5"
                    }`}
                  >
                    <Award
                      size={16}
                      strokeWidth={1.5}
                      className={
                        acc.active
                          ? "text-secondary-500"
                          : "text-primary-500/30"
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[13px] font-semibold text-primary-500">
                        {acc.name}
                      </span>
                      {acc.active && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-600/80 uppercase tracking-tight">
                          Aktif
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-primary-500/50 mt-0.5 leading-relaxed">
                      {acc.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </MainCard>

          <MainCard title="Sayılarla Bölüm" dark>
            <div className="grid grid-cols-2 gap-4 w-full pt-2">
              {academicStats.map((stat) => (
                <div
                  key={stat.id}
                  className="flex flex-col py-2 border-b border-white/5 last:border-0"
                >
                  <div className="font-mono text-secondary-500 font-semibold text-xl leading-none">
                    {stat.value}
                  </div>
                  <div className="text-white/40 text-[11px] mt-1.5 tracking-wide font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </MainCard>
        </div>
      </div>
    </PageLayout>
  );
}
