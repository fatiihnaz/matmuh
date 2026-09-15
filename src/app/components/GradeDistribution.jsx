"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useT } from "@/i18n/useT";

const LOW_GRADES = new Set(["DD", "FD", "FF", "F0"]);

export const isLowGrade = (grade) => LOW_GRADES.has(grade);
export const isHighlightGrade = (grade) => grade === "DC";

export default function GradeDistribution({ data }) {
  const t = useT();
  if (!data || data.length === 0) {
    return (
      <div className="text-sm font-medium text-primary-500/70 py-8 px-2 border border-dashed border-primary-500/20 rounded-xl text-center">
        {t("Bu aralık için dağılım verisi bulunmuyor.")}
      </div>
    );
  }

  const counts = data.map((d) => Number(d.count) || 0);
  const maxCount = Math.max(...counts);
  const safeMax = maxCount > 0 ? maxCount : 1;
  const total = counts.reduce((sum, c) => sum + c, 0);

  return (
    <div className="relative pt-2 sm:pt-0">
      <div className="sm:hidden absolute -top-5 right-0 flex justify-end pointer-events-none">
        <span className="text-[10px] flex items-center gap-1 text-primary-500/70">
          {t("Kaydırın")} <ArrowRight size={10} />
        </span>
      </div>
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="min-w-100 sm:min-w-0 space-y-2.5">
          <div className="flex text-[10px] font-bold text-primary-500/70 uppercase mb-4 px-1 tracking-widest">
            <div className="w-12">{t("HARF")}</div>
            <div className="w-10">{t("BAŞ")}</div>
            <div className="w-10">{t("BİTİŞ")}</div>
            <div className="flex-1">{t("DAĞILIM")}</div>
            <div className="w-10 text-right">{t("SAY")}</div>
            <div className="w-12 text-right">{t("ORN")}</div>
          </div>
          {data.map((item, idx) => {
            const count = Number(item.count) || 0;
            const barWidth = `${(count / safeMax) * 100}%`;
            const percent = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
            const barColor = isLowGrade(item.grade)
              ? "bg-primary-500/20"
              : isHighlightGrade(item.grade)
                ? "bg-secondary-500"
                : "bg-primary-500";

            return (
              <div key={idx} className="flex items-center text-xs px-1 font-mono">
                <div className="w-12 font-bold text-primary-500 text-sm tracking-tight">
                  {item.grade}
                </div>
                <div className="w-10 text-primary-500/70">{item.start}</div>
                <div className="w-10 text-primary-500/70">{item.end}</div>
                <div className="flex-1 px-4 flex items-center">
                  <div className="h-2 w-full bg-primary-500/5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${barColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: barWidth }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.05 }}
                    />
                  </div>
                </div>
                <div className="w-10 text-right text-primary-500/70 font-bold">
                  {count}
                </div>
                <div className="w-12 text-right text-primary-500/70">{percent}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
