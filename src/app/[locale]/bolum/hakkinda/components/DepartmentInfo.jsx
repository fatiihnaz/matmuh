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
  Briefcase,
  GraduationCap,
  ArrowUpRight,
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
  {
    id: "fonk",
    label: "Fonksiyonel Analiz",
    icon: Atom,
    size: "sm",
    cx: 15,
    cy: 35,
  },
  {
    id: "ters",
    label: "Ters Problemler",
    icon: Globe,
    size: "sm",
    cx: 50,
    cy: 80,
  },
  {
    id: "mfiz",
    label: "Matematiksel Fizik",
    icon: Atom,
    size: "sm",
    cx: 85,
    cy: 80,
  },
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
  { source: "dif", target: "ters" },
  { source: "dif", target: "mfiz" },
  { source: "fonk", target: "stok" },
  { source: "fonk", target: "fin" },
  { source: "ist", target: "dif" },
];

const milestones = [
  { year: "1911", event: "Kondüktör Mekteb-i Âlîsi adıyla kuruluş" },
  { year: "1922", event: "Nafia Fen Mektebi'ne dönüşüm" },
  { year: "1937", event: "İstanbul Teknik Okulu adını alması" },
  {
    year: "1969",
    event: "İstanbul Devlet Mühendislik ve Mimarlık Akademisi'ne dönüşüm",
  },
  { year: "1982", event: "Yıldız Üniversitesi'nin kurulması" },
  {
    year: "1992",
    event:
      "Yıldız Teknik Üniversitesi adının alınması ve Kimya-Metalurji Fakültesi'nin kurulması",
  },
];

const keyMetrics = [
  { id: "akts", value: "240", label: "AKTS", sub: "Lisans Programı" },
  { id: "yariyil", value: "8", label: "Yarıyıl", sub: "Dört Yıllık Eğitim" },
  {
    id: "program",
    value: "2",
    label: "Lisans Programı",
    sub: "%100 ve %30 İngilizce",
  },
  {
    id: "kadro",
    value: "26",
    label: "Akademisyen",
    sub: "Bölüme Özgü Kadro",
  },
];

const academicStats = [
  { id: "profesor", value: "14", label: "Profesör" },
  { id: "docent", value: "10", label: "Doçent" },
  { id: "druyesi", value: "2", label: "Dr. Öğr. Üyesi" },
  { id: "lisansustu", value: "2", label: "Lisansüstü Program" },
  { id: "staj", value: "40", label: "İş Günü Zorunlu Staj" },
  { id: "turkiye", value: "2", label: "Türkiye'de Program Sayısı" },
];

const educationalGoals = [
  {
    id: "ea1",
    code: "EA1",
    text: "Meslek içi ve sürekli eğitim programlarına katılan,",
  },
  {
    id: "ea2",
    code: "EA2",
    text: "Ulusal ve uluslararası özel sektör ya da kamu kuruluşlarında yönetim ve uygulama kadrolarında çalışan,",
  },
  {
    id: "ea3",
    code: "EA3",
    text: "Yurt içinde veya yurt dışında lisansüstü öğrenim gören,",
  },
  {
    id: "ea4",
    code: "EA4",
    text: "Üniversitelerde akademisyen olarak görev yapan matematik mühendisleri yetiştirmek.",
  },
];

const careerGroups = [
  {
    id: "kurumlar",
    label: "Çalışılan Kurumlar",
    items: [
      "TÜBİTAK",
      "MTA",
      "TÜİK",
      "Üniversite araştırma laboratuvarları",
      "Sigorta ve finans kuruluşları",
      "Bilgi işlem birimleri",
    ],
  },
  {
    id: "gorevler",
    label: "Görev Alanları",
    items: [
      "Yazılım Uzmanı / Mühendisi",
      "Veri Tabanı Uzmanı",
      "Sistem ve İş Analisti",
      "İstatistiksel Analist",
      "Matematikçi",
    ],
  },
];

const internships = [
  {
    id: "staj1",
    code: "MTM2002",
    title: "Bilgisayar Donanımı ve Temel Uygulamaları Stajı",
    days: "20 iş günü",
    note: "Birinci aşama",
  },
  {
    id: "staj2",
    code: "MTM3002",
    title: "Sorun Çözüm Teknikleri Stajı",
    days: "20 iş günü",
    note: "1. staj tamamlandıktan sonra, en az dört departmanlı orta/büyük ölçekli bir işletmede",
  },
];

function NodeGraphCanvas() {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleMediaChange = (e) => setIsMobile(e.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  if (!isMounted) return <div className="w-full h-full bg-primary-500" />;

  return (
    <div
      className="relative w-full h-full bg-primary-500 overflow-hidden select-none"
      onClick={() => setHoveredNode(null)}
    >
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
              strokeWidth={
                isHighlighted ? (isMobile ? 1.2 : 1.5) : isMobile ? 0.8 : 1
              }
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

          const radius =
            node.size === "lg"
              ? isMobile
                ? 4.5
                : 6
              : node.size === "md"
                ? isMobile
                  ? 3.5
                  : 4.5
                : isMobile
                  ? 2.5
                  : 3;

          const fontSize =
            node.size === "lg"
              ? isMobile
                ? "10px"
                : "12px"
              : node.size === "md"
                ? isMobile
                  ? "9px"
                  : "10px"
                : isMobile
                  ? "8px"
                  : "9px";

          return (
            <g
              key={node.id}
              onMouseEnter={() => !isMobile && setHoveredNode(node.id)}
              onMouseLeave={() => !isMobile && setHoveredNode(null)}
              onClick={(e) => {
                e.stopPropagation();
                setHoveredNode(isHovered ? null : node.id);
              }}
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
                dy={radius + (isMobile ? 12 : 16)}
                textAnchor="middle"
                fill={isHovered ? "#FFF" : "rgba(255, 255, 255, 0.6)"}
                fontSize={fontSize}
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

          <MainCard title="Program Eğitim Amaçları">
            <div className="flex flex-col gap-3 pt-2">
              <p className="text-[13px] text-primary-500/60 leading-relaxed">
                Matematik Mühendisliği, temel ve uygulamalı matematik bilgisiyle
                mühendislik, ekonomi ve sosyal hayatta karşılaşılan olayların
                matematiksel modelini kuran, bu modellere çözüm üreten ve bu
                amaçla bilgisayar yazılım ve uygulamaları geliştiren mühendisler
                yetiştirir.
              </p>
              <div className="flex flex-col gap-2 mt-1">
                {educationalGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-primary-500/2 border border-primary-500/5"
                  >
                    <span className="font-mono text-[11px] font-bold text-secondary-500 shrink-0 mt-0.5">
                      {goal.code}
                    </span>
                    <span className="text-[13px] text-primary-500/70 leading-relaxed">
                      {goal.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </MainCard>

          <MainCard title="Çalışma ve Araştırma Alanları">
            <div className="flex flex-col -mx-6 -mb-6">
              <div className="relative bg-primary-500 h-85 w-full group border-y border-primary-500/10">
                <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/20 pointer-events-none z-10" />
                <div className="absolute inset-0 z-0">
                  <NodeGraphCanvas />
                </div>
                <div className="absolute bottom-4 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5">
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
                            ? "bg-secondary-500/3 border-secondary-500/10"
                            : "bg-transparent border-primary-500/5"
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-lg transition-colors ${
                            isLarge
                              ? "bg-secondary-500/10 text-secondary-500"
                              : "bg-primary-500/3 text-primary-500/30 group-hover:text-secondary-500"
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

          <MainCard title="Kariyer ve Mezun Profili">
            <div className="flex flex-col md:flex-row gap-8 w-full pt-1">
              {careerGroups.map((group) => (
                <div key={group.id} className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="size-4 text-secondary-500" />
                    <span className="font-semibold text-[13px] text-primary-500">
                      {group.label}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-[13px] text-primary-500/60 leading-relaxed"
                      >
                        <span className="w-1 h-1 rounded-full bg-secondary-500/50 shrink-0 mt-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </MainCard>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <MainCard title="Kilometre Taşları">
            <div className="relative pt-2">
              <div className="absolute left-4.5 top-2 bottom-4 w-px bg-primary-500/10" />
              <div className="flex flex-col">
                {milestones.map((item, idx) => (
                  <div
                    key={item.year}
                    className="relative flex items-start gap-4 py-3 group"
                  >
                    <div className="relative z-10 shrink-0 w-9 flex justify-center">
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

          <MainCard title="Staj Sistemi">
            <div className="flex flex-col gap-3 pt-2">
              <p className="text-[13px] text-primary-500/60 leading-relaxed">
                Öğrenciler eğitimleri boyunca toplam{" "}
                <span className="font-semibold text-primary-500">
                  40 iş günü
                </span>{" "}
                zorunlu staj yapar. Staj yapılan departmanda en az bir mühendis
                bulunmalıdır.
              </p>
              {internships.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg bg-primary-500/2 border border-primary-500/5"
                >
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <GraduationCap className="size-4 text-secondary-500 shrink-0" />
                    <span className="font-mono text-[12px] font-semibold text-primary-500">
                      {item.code}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-secondary-500/10 text-secondary-600">
                      {item.days}
                    </span>
                  </div>
                  <div className="text-[13px] font-medium text-primary-500 leading-snug">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-primary-500/45 mt-1 leading-relaxed">
                    {item.note}
                  </div>
                </div>
              ))}
            </div>
          </MainCard>

          <MainCard title="Çift Anadal ve Yandal">
            <div className="flex flex-col gap-3 pt-2">
              <p className="text-[13px] text-primary-500/60 leading-relaxed">
                Çift Anadal (ÇAP) ve Yandal başvuruları,{" "}
                <span className="font-semibold text-primary-500">
                  YÖ-098 sayılı YTÜ Lisans Düzeyindeki Programlar Arasında Geçiş
                  ile Çift Anadal ve Yan Dal Yönergesi
                </span>{" "}
                çerçevesinde yürütülür. Bölümün yayımlanmış bir Yandal Programı
                ders planı bulunmaktadır.
              </p>
              <p className="text-[12px] text-primary-500/45 leading-relaxed">
                Başvuru koşulları ve o yıl açılan program listesi her akademik
                yıl güncellendiğinden, güncel bilgi için Öğrenci İşleri Daire
                Başkanlığı duyurularını takip ediniz.
              </p>
              <a
                href="https://ogi.yildiz.edu.tr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-secondary-500 hover:text-secondary-600 transition-colors"
              >
                Öğrenci İşleri Daire Başkanlığı
                <ArrowUpRight size={13} strokeWidth={2} />
              </a>
            </div>
          </MainCard>

          <MainCard title="Sayılarla Bölüm" dark>
            <div className="grid grid-cols-2 gap-4 w-full pt-2">
              {academicStats.map((stat, idx) => (
                <div
                  key={stat.id}
                  className={`flex flex-col py-2 ${
                    idx < academicStats.length - (academicStats.length % 2 || 2)
                      ? "border-b border-white/5"
                      : ""
                  }`}
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
