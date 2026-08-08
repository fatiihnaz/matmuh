"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  MapPin,
  User,
  BarChart3,
  Lock,
  Library,
  NotebookPen,
  Calendar,
  FileText,
  Sigma,
  Percent,
  Shield,
  Eye,
  ChevronDown,
  Database,
  GraduationCap,
  Upload,
  ArrowRight,
  Info,
} from "lucide-react";
import PageLayout from "@/app/components/PageLayout";
import MainCard from "@/app/components/MainCard";
import { staffData } from "@/data/staff";
import { obsdata } from "@/data/obsdata";

const bgColors = [
  "#1D2445",
  "#2a3158",
  "#33295a",
  "#1a3348",
  "#2d3a2e",
  "#3a2d2d",
  "#2a2d45",
  "#1D2445",
  "#2a3158",
  "#33295a",
  "#1a3348",
  "#2d3a2e",
  "#3a2d2d",
  "#2a2d45",
  "#1D2445",
  "#2a3158",
];

const sampleResources = [
  {
    id: 1,
    title: "2025 Vize Soruları.pdf",
    date: "14 Şub 2026",
    type: "PDF",
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Hafta 4 - Teorem İspatları.zip",
    date: "10 Şub 2026",
    type: "ZIP",
    size: "8.1 MB",
  },
  {
    id: 3,
    title: "Cauchy-Riemann Örnekler.pdf",
    date: "05 Şub 2026",
    type: "PDF",
    size: "1.8 MB",
  },
  {
    id: 4,
    title: "2024 Final Çözümleri.pdf",
    date: "01 Şub 2026",
    type: "PDF",
    size: "4.2 MB",
  },
];

export default function CourseInfo({ course }) {
  const [activeTab, setActiveTab] = useState(0);

  const searchCode = String(
    course?.code || course?.id || course?.courseCode || ""
  ).toUpperCase();

  const courseData = useMemo(() => {
    return obsdata[0]?.[searchCode] || null;
  }, [searchCode]);

  const availableTerms = useMemo(() => {
    if (!courseData?.terms) return [];
    return Object.values(courseData.terms).sort((a, b) =>
      b.termId.localeCompare(a.termId)
    );
  }, [courseData]);

  const [selectedTermId, setSelectedTermId] = useState("");
  const [selectedProfId, setSelectedProfId] = useState("");

  const activeTermId = useMemo(() => {
    if (availableTerms.length === 0) return "";
    const exists = availableTerms.find((t) => t.termId === selectedTermId);
    return exists ? exists.termId : availableTerms[0].termId;
  }, [availableTerms, selectedTermId]);

  const currentTermData = courseData?.terms?.[activeTermId] || null;

  const availableProfs = useMemo(() => {
    if (!currentTermData?.professors) return [];
    return Object.values(currentTermData.professors);
  }, [currentTermData]);

  const activeProfId = useMemo(() => {
    if (availableProfs.length === 0) return "";
    const exists = availableProfs.find((p) => p.profId === selectedProfId);
    return exists ? exists.profId : availableProfs[0].profId;
  }, [availableProfs, selectedProfId]);

  const currentProfData = currentTermData?.professors?.[activeProfId] || null;

  const activeStats = useMemo(() => {
    if (!currentProfData?.groups) return null;
    const groups = Object.values(currentProfData.groups);
    if (groups.length === 0) return null;
    return groups[0].stats || null;
  }, [currentProfData]);

  const statsSummary = useMemo(() => {
    if (
      !activeStats?.gradeDistribution ||
      activeStats.gradeDistribution.length === 0
    ) {
      return {
        average: 0,
        stdDev: 0,
        enrolled: 0,
        passed: 0,
        failed: 0,
        passRate: 0,
        avgLevel: "Veri Yok",
      };
    }

    const dist = activeStats.gradeDistribution;
    const enrolled = dist.reduce(
      (acc, curr) => acc + (Number(curr.count) || 0),
      0
    );
    const passed = dist
      .filter((g) => !g.low && !["FF", "FD", "F0"].includes(g.grade))
      .reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);

    const average = activeStats.summary?.average || 0;

    return {
      average: average,
      stdDev: activeStats.summary?.stdDev || 0,
      enrolled: enrolled,
      passed: passed,
      failed: enrolled - passed,
      passRate: enrolled > 0 ? ((passed / enrolled) * 100).toFixed(1) : 0,
      avgLevel: average >= 65 ? "Yüksek" : average >= 45 ? "Orta" : "Düşük",
    };
  }, [activeStats]);

  if (!course) return null;

  const completedCount = course.syllabus?.filter((s) => s.done).length || 0;
  const totalCount = course.syllabus?.length || 0;
  const progressPercent =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const tabs = [
    { label: "Genel", icon: GraduationCap, locked: false },
    { label: "Müfredat", icon: Library, locked: false },
    { label: "Ders Notları", icon: NotebookPen, badge: "8", locked: true },
    { label: "Geçmiş İstatistikler", icon: BarChart3, locked: false },
  ];

  const renderDistributionBars = (data) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-sm font-medium text-primary-500/40 py-8 px-2 border border-dashed border-primary-500/20 rounded-xl text-center">
          Bu aralık için dağılım verisi bulunmuyor.
        </div>
      );
    }

    const maxCount = Math.max(...data.map((d) => Number(d.count) || 0));
    const safeMax = maxCount > 0 ? maxCount : 1;

    return (
      <div className="relative pt-2 sm:pt-0">
        <div className="sm:hidden absolute -top-5 right-0 flex justify-end pointer-events-none">
          <span className="text-[10px] flex items-center gap-1 text-primary-500/30">
            Kaydırın <ArrowRight size={10} />
          </span>
        </div>
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="min-w-100 sm:min-w-0 space-y-2.5">
            <div className="flex text-[10px] font-bold text-primary-500/40 uppercase mb-4 px-1 tracking-widest">
              <div className="w-12">HARF</div>
              <div className="w-10">BAŞ</div>
              <div className="w-10">BİTİŞ</div>
              <div className="flex-1">DAĞILIM</div>
              <div className="w-10 text-right">SAY</div>
              <div className="w-12 text-right">ORN</div>
            </div>
            {data.map((item, idx) => {
              const count = Number(item.count) || 0;
              const barWidth = `${(count / safeMax) * 100}%`;
              const barColor = item.low
                ? "bg-primary-500/20"
                : item.highlight
                ? "bg-secondary-500"
                : "bg-primary-500";

              return (
                <div
                  key={idx}
                  className="flex items-center text-xs px-1 font-mono"
                >
                  <div className="w-12 font-bold text-primary-500 text-sm tracking-tight">
                    {item.grade}
                  </div>
                  <div className="w-10 text-primary-500/50">{item.start}</div>
                  <div className="w-10 text-primary-500/50">{item.end}</div>
                  <div className="flex-1 px-4 flex items-center">
                    <div className="h-2 w-full bg-primary-500/5 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${barColor}`}
                        initial={{ width: 0 }}
                        animate={{ width: barWidth }}
                        transition={{
                          duration: 0.8,
                          ease: "easeOut",
                          delay: idx * 0.05,
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-10 text-right text-primary-500/60 font-bold">
                    {count}
                  </div>
                  <div className="w-12 text-right text-primary-500/40">
                    {item.percent}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const tabVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };
  const tabTransition = { duration: 0.2 };

  const SidebarContent = (
    <div className="flex flex-col gap-5 lg:sticky lg:top-8 font-sans">
      <MainCard title="Şubeler & Program">
        <div className="space-y-6 pt-2">
          {course.sections?.map((section, idx) => {
            const staffMember = staffData.academics.find(
              (s) => s.id === section.staffId
            );
            const instructorFullName = staffMember
              ? `${staffMember.rank} ${staffMember.name}`
              : "Öğretim Görevlisi";
            const avatarColor = bgColors[idx % bgColors.length];

            return (
              <div key={idx} className="group">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="size-11 rounded-full flex items-center justify-center font-semibold text-sm shrink-0"
                    style={{
                      backgroundColor: avatarColor,
                      color: "var(--color-secondary-500, #AD976F)",
                    }}
                  >
                    {staffMember?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("") || "AY"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-primary-500 leading-tight">
                      {instructorFullName}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-primary-500/50">
                        Grup {section.groupNo}
                      </span>
                      {staffMember && (
                        <a
                          href={`https://avesis.yildiz.edu.tr/${staffMember.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary-500/50 hover:text-secondary-500 transition-colors"
                        >
                          <User size={12} /> AVESİS
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {!section.schedule?.length && (
                    <div className="p-3 rounded-lg border border-dashed border-primary-500/15 text-xs text-primary-500/40 text-center">
                      Bu şube için program bilgisi girilmemiş.
                    </div>
                  )}
                  {section.schedule?.map((sched, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3 rounded-lg bg-primary-500/2 border border-primary-500/10"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-primary-500">
                          {sched.day}
                        </span>
                        <span className="text-[10px] font-bold text-secondary-500 bg-secondary-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                          {sched.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-primary-500/50">
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} /> {sched.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={12} /> {sched.room}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {!course.sections?.length && (
            <div className="flex flex-col items-center gap-2 text-sm font-medium text-primary-500/40 py-8 px-4 border border-dashed border-primary-500/20 rounded-xl text-center">
              <Info size={18} strokeWidth={1.5} className="text-primary-500/25" />
              Bu ders için şube ve program bilgisi henüz girilmemiş.
            </div>
          )}
        </div>
      </MainCard>

      <MainCard title="Ders Bilgileri">
        <div className="space-y-3 pt-2">
          {[
            { label: "Kredi", value: course.hours },
            { label: "ECTS", value: course.ects },
            {
              label: "Yarıyıl",
              value: course.semester ? `${course.semester}. Yarıyıl` : "—",
            },
            { label: "Dil", value: course.language },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-primary-500/40 font-medium">
                {item.label}
              </span>
              <span className="font-medium text-primary-500 font-mono">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </MainCard>
    </div>
  );

  return (
    <PageLayout sidebar={SidebarContent}>
      <div className="bg-white rounded-xl shadow-xs border border-primary-500/10 overflow-hidden min-h-150 font-sans">
        <div className="flex items-center border-b border-primary-500/10 px-2 overflow-x-auto no-scrollbar bg-white">
          {tabs.map((tab, idx) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-4 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap
                ${
                  activeTab === idx
                    ? "border-secondary-500 text-secondary-500"
                    : "border-transparent text-primary-500/40 hover:text-primary-500"
                }`}
            >
              {tab.icon && (
                <tab.icon
                  size={16}
                  className={
                    activeTab === idx
                      ? "text-secondary-500"
                      : "text-primary-500/40"
                  }
                />
              )}
              {tab.label}
              {tab.badge && (
                <span className="bg-primary-500/5 text-primary-500/60 text-[10px] px-2 py-0.5 rounded-md font-bold ml-1 font-mono">
                  {tab.badge}
                </span>
              )}
              {tab.locked && (
                <Lock
                  size={14}
                  className={
                    activeTab === idx
                      ? "text-secondary-500"
                      : "text-primary-500/30"
                  }
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-8 min-h-full">
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div
                key="tab0"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={tabTransition}
                className="space-y-8"
              >
                <div className="group">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-4 bg-secondary-500 rounded-full" />
                    <h3 className="text-xs font-bold text-primary-500 uppercase tracking-widest">
                      Ders Hakkında
                    </h3>
                  </div>
                  <p className="text-sm text-primary-500/60 leading-relaxed border-l-2 border-primary-500/10 pl-5 py-1">
                    {course.content}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="p-4 rounded-xl bg-primary-500/2 border border-primary-500/10">
                    <span className="text-[10px] font-bold text-secondary-500 uppercase tracking-widest block mb-2">
                      Eğitim Dili
                    </span>
                    <p className="text-sm font-semibold text-primary-500">
                      {course.language}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-primary-500/2 border border-primary-500/10">
                    <span className="text-[10px] font-bold text-secondary-500 uppercase tracking-widest block mb-2">
                      Değerlendirme Sistemi
                    </span>
                    <p className="text-sm font-semibold text-primary-500">
                      {course.assessment
                        ? `Vize %${course.assessment.midterm?.weight ?? 0} + Final %${course.assessment.final?.weight ?? 0}`
                        : "—"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div
                key="tab1"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={tabTransition}
                className="w-full"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <Calendar
                      size={16}
                      className="text-secondary-500"
                      strokeWidth={1.5}
                    />
                    <span className="text-sm font-semibold text-primary-500">
                      Haftalık İçerik
                    </span>
                  </div>
                  <span className="text-xs font-medium text-primary-500/40">
                    {completedCount} / {totalCount} tamamlandı
                  </span>
                </div>
                <div className="mb-8 h-1.5 w-full bg-primary-500/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-secondary-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="flex flex-col">
                  {course.syllabus?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-5 py-3.5 border-b border-primary-500/10 last:border-0"
                    >
                      <div
                        className={`shrink-0 size-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                          item.done
                            ? "bg-secondary-500 text-white"
                            : "bg-primary-500/5 border border-primary-500/10 text-primary-500/40"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span
                        className={`text-sm transition-colors ${
                          item.done
                            ? "font-semibold text-primary-500"
                            : "font-medium text-primary-500/40"
                        }`}
                      >
                        {item.topic}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 2 && (
              <motion.div
                key="tab2"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={tabTransition}
                className="w-full"
              >
                <div className="rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-start gap-4 bg-primary-500/3 border border-primary-500/10">
                  <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mt-0.5 bg-secondary-500/10">
                    <Shield
                      size={20}
                      strokeWidth={1.5}
                      className="text-secondary-500"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[15px] font-bold text-primary-700 mb-1.5">
                      Giriş Yapmanız Gerekmektedir
                    </h4>
                    <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                      Ders notlarını görüntülemek ve kaynak indirmek için{" "}
                      <span className="font-mono text-[11px] font-bold text-secondary-500 bg-secondary-500/5 px-1 py-0.5 rounded">
                        @std.yildiz.edu.tr
                      </span>{" "}
                      hesabınızla giriş yapmalısınız.
                    </p>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary-500 text-primary-500 text-xs font-semibold transition-all hover:bg-secondary-500/80 shadow-md shadow-secondary-500/20">
                      <Lock size={14} strokeWidth={2} /> Öğrenci Girişi
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 backdrop-blur-sm shadow-xl">
                      <Eye
                        size={16}
                        strokeWidth={2}
                        className="text-secondary-500"
                      />
                      <span className="text-[13px] font-medium text-white">
                        Önizleme - Giriş yapın
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 filter blur-[6px] opacity-40 select-none pointer-events-none">
                    {sampleResources.map((res) => (
                      <div
                        key={res.id}
                        className="rounded-xl p-4 border border-gray-100 bg-white shadow-xs flex items-start gap-4"
                      >
                        <div className="w-12 h-14 rounded-lg flex flex-col items-center justify-center bg-primary-500/5">
                          <FileText
                            size={20}
                            className="text-primary-700"
                            strokeWidth={1.5}
                          />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-sm font-semibold text-primary-700 truncate mb-1.5">
                            {res.title}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-gray-400 font-mono">
                              {res.date}
                            </span>
                            <span className="text-[11px] font-bold text-secondary-500 bg-secondary-500/10 px-1.5 py-0.5 rounded">
                              {res.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 3 && (
              <motion.div
                key="tab3"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={tabTransition}
                className="w-full space-y-8"
              >
                {courseData && activeStats ? (
                  <>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-auto">
                          <select
                            value={activeTermId}
                            onChange={(e) => {
                              setSelectedTermId(e.target.value);
                              setSelectedProfId("");
                            }}
                            className="w-full appearance-none bg-white border border-primary-500/10 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-primary-500 outline-none hover:border-primary-500/20 transition-colors cursor-pointer shadow-xs"
                          >
                            {availableTerms.map((t) => (
                              <option key={t.termId} value={t.termId}>
                                {t.termName}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-500/40 pointer-events-none"
                          />
                        </div>

                        <div className="relative w-full sm:w-auto">
                          <select
                            value={activeProfId}
                            onChange={(e) => setSelectedProfId(e.target.value)}
                            className="w-full appearance-none bg-white border border-primary-500/10 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-primary-500 outline-none hover:border-primary-500/20 transition-colors cursor-pointer shadow-xs"
                          >
                            {availableProfs.map((p) => (
                              <option key={p.profId} value={p.profId}>
                                {p.profName}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-500/40 pointer-events-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/5 border border-primary-500/10 shrink-0">
                        <Database size={12} className="text-primary-500/40" />
                        <span className="text-[10px] font-bold text-primary-500/40 uppercase tracking-wider">
                          OBS Verisi ({searchCode})
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <MainCard title="HARF ARALIKLARI DAĞILIMI">
                        <div className="mt-4">
                          {renderDistributionBars(
                            activeStats.gradeDistribution
                          )}
                        </div>
                      </MainCard>
                      <MainCard title="BÜTÜNLEME HARF ARALIKLARI DAĞILIMI">
                        <div className="mt-4">
                          {renderDistributionBars(
                            activeStats.makeupDistribution
                          )}
                        </div>
                      </MainCard>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 font-sans text-primary-500">
                      {[
                        {
                          label: "Sınıf Ortalaması",
                          val: statsSummary.average,
                          sub: `Sınıf Düzeyi: ${statsSummary.avgLevel}`,
                          icon: GraduationCap,
                        },
                        {
                          label: "Standart Sapma",
                          val: statsSummary.stdDev,
                          sub: "σ dağılımı",
                          icon: Sigma,
                        },
                        {
                          label: "Dersi Alan",
                          val: statsSummary.enrolled,
                          sub: `Geçme: %${statsSummary.passRate}`,
                          icon: User,
                          suffix: "Öğrenci",
                        },
                      ].map((stat, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-xl p-4 sm:p-5 border border-primary-500/10 shadow-xs flex flex-col justify-between h-full min-h-35 group hover:border-primary-500/20 transition-all"
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <div className="size-8 rounded-lg bg-secondary-500/10 flex items-center justify-center text-secondary-500 shrink-0">
                              <stat.icon size={14} strokeWidth={2.5} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500/40 leading-tight">
                              {stat.label}
                            </span>
                          </div>
                          <div className="mt-auto">
                            <div className="text-2xl sm:text-3xl font-mono font-bold text-primary-500 mb-1 tracking-tighter leading-none">
                              {stat.val}
                              {stat.suffix && (
                                <span className="text-[10px] font-sans text-primary-500/40 ml-1 tracking-normal">
                                  {stat.suffix}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-primary-500/40 tracking-tight">
                              {stat.sub}
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="bg-white rounded-xl p-4 sm:p-5 border border-primary-500/10 shadow-xs flex flex-col justify-between h-full min-h-35 group hover:border-primary-500/20 transition-all">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="size-8 rounded-lg bg-secondary-500/10 flex items-center justify-center text-secondary-500 shrink-0">
                            <User size={12} strokeWidth={2.5} />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500/40 leading-none">
                            Geçme Oranı
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-auto">
                          <div className="relative size-12 flex items-center justify-center shrink-0">
                            <svg
                              className="absolute inset-0 size-full -rotate-90"
                              viewBox="0 0 100 100"
                            >
                              {[0, 1, 2, 3].map((index) => {
                                const quarter = 62.83;
                                const gap = 16;
                                const maxLen = quarter - gap;
                                const offset = -(index * quarter);

                                return (
                                  <g key={index}>
                                    <circle
                                      cx="50"
                                      cy="50"
                                      r="40"
                                      fill="transparent"
                                      stroke="#F4F5F7"
                                      strokeWidth="7"
                                      strokeLinecap="round"
                                      strokeDasharray={`${maxLen} ${
                                        251.32 - maxLen
                                      }`}
                                      strokeDashoffset={offset}
                                    />
                                    <motion.circle
                                      cx="50"
                                      cy="50"
                                      r="40"
                                      fill="transparent"
                                      stroke="#AD976F"
                                      strokeWidth="7"
                                      strokeLinecap="round"
                                      strokeDasharray={`0 251.32`}
                                      strokeDashoffset={offset}
                                      animate={{
                                        strokeDasharray: `${
                                          (statsSummary.passRate / 100) * maxLen
                                        } ${251.32 - maxLen}`,
                                      }}
                                      transition={{
                                        duration: 1,
                                        ease: "circOut",
                                        delay: index * 0.05,
                                      }}
                                    />
                                  </g>
                                );
                              })}
                            </svg>
                            <div className="relative flex items-center justify-center">
                              <span className="text-[10px] font-mono font-bold text-primary-500">
                                %{statsSummary.passRate}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="size-1.5 rounded-full bg-secondary-500 shrink-0" />
                              <span className="text-[10px] text-primary-500/40 w-8">
                                Geçen
                              </span>
                              <span className="font-bold text-primary-500 font-mono text-xs leading-none">
                                {statsSummary.passed}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="size-1.5 rounded-full bg-primary-500/20 shrink-0" />
                              <span className="text-[10px] text-primary-500/40 w-8">
                                Kalan
                              </span>
                              <span className="font-bold text-primary-500 font-mono text-xs leading-none">
                                {statsSummary.failed}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {activeStats.exams?.map((exam, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-xl border border-primary-500/10 shadow-xs overflow-hidden group hover:border-primary-500/20 transition-all duration-300"
                        >
                          <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                              <div className="size-8 rounded-lg bg-secondary-500/10 flex items-center justify-center text-secondary-500 group-hover:bg-secondary-500 group-hover:text-white transition-all duration-300">
                                {exam.id === "FINAL" ? (
                                  <GraduationCap size={14} />
                                ) : exam.id === "MAKEUP" ? (
                                  <Upload size={14} />
                                ) : (
                                  <FileText size={14} />
                                )}
                              </div>
                              <span className="text-[11px] font-bold text-primary-500/40 uppercase tracking-wider leading-none">
                                {exam.name}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 sm:flex sm:items-center sm:gap-6 bg-primary-500/5 sm:bg-transparent rounded-lg sm:rounded-none py-2 sm:py-0 divide-x divide-primary-500/10 sm:divide-x-0">
                              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-1 sm:gap-2">
                                <Percent size={14} className="text-secondary-500" />
                                <span className="font-bold text-sm text-primary-500 font-mono">
                                  {exam.weight}
                                </span>
                                <span className="text-[10px] sm:text-xs font-sans text-primary-500/40 sm:text-primary-500">
                                  ETKİ
                                </span>
                              </div>
                              <div className="hidden sm:block w-px h-8 bg-primary-500/10" />
                              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-1 sm:gap-2">
                                <Sigma size={14} className="text-secondary-500" />
                                <span className="font-bold text-sm text-primary-500 font-mono">
                                  {exam.average}
                                </span>
                                <span className="text-[10px] sm:text-xs font-sans text-primary-500/40 sm:text-primary-500">
                                  ORT
                                </span>
                              </div>
                              <div className="hidden sm:block w-px h-8 bg-primary-500/10" />
                              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-1 sm:gap-2">
                                <User size={14} className="text-secondary-500" />
                                <span className="font-bold text-sm text-primary-500 font-mono">
                                  {exam.students}
                                </span>
                                <span className="text-[10px] sm:text-xs font-sans text-primary-500/40 sm:text-primary-500">
                                  ÖĞR
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                            <div className="h-2 w-full bg-primary-500/3 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-primary-500 rounded-full shadow-[0_2px_8px_rgba(29,36,69,0.15)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${exam.average}%` }}
                                transition={{
                                  duration: 0.8,
                                  ease: "easeOut",
                                  delay: idx * 0.1,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-primary-500/5 rounded-xl border border-primary-500/10 border-dashed">
                    <Database
                      size={48}
                      strokeWidth={1}
                      className="text-primary-500/20 mb-4"
                    />
                    <h3 className="text-lg font-bold text-primary-500 mb-2">
                      İstatistik Verisi Bulunamadı
                    </h3>
                    <p className="text-sm text-primary-500/50 text-center max-w-sm mb-4">
                      Sisteme aranan{" "}
                      <strong>{searchCode || "Bilinmeyen Ders"}</strong> koduna
                      ait güncel istatistik verisi henüz yüklenmemiş olabilir.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  );
}