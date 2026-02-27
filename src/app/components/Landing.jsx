"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Search, Users, GraduationCap, BookOpen, FlaskConical } from "lucide-react";

const stats = [
  { icon: Users, value: 32, suffix: "", label: "Akademik Kadro" },
  { icon: GraduationCap, value: 450, suffix: "+", label: "Aktif Öğrenci" },
  { icon: BookOpen, value: 85, suffix: "+", label: "Yayın / Yıl" },
  { icon: FlaskConical, value: 4, suffix: "", label: "Araştırma Grubu" },
];

function CountUp({ value, suffix, delay }) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const controls = animate(motionVal, value, {
        duration: 2.5,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => setIsFinished(true),
      });
      return () => controls.stop();
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [motionVal, value, delay]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return () => unsubscribe();
  }, [rounded]);

  return (
    <>
      {display}
      {suffix && (
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: isFinished ? 1 : 0 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
          {suffix}
        </motion.span>
      )}
    </>
  );
}

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative pb-12 sm:pb-14">
      <section className="relative w-full h-[40vh] sm:h-[60vh] md:h-[70vh] min-h-80 flex items-center justify-center overflow-hidden bg-[#2c3760]">
        <Image src="/Landing.png" alt="YTÜ Davutpaşa Kampüsü" fill className="object-cover" priority />

        <div className="relative z-10 flex flex-col items-center gap-8 sm:gap-12 px-4 w-full max-w-7xl -mt-20 sm:-mt-5">

          <div className="text-center">
            <motion.h1 initial={{ opacity: 0, y: 15, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-wide leading-tight"
            >
              YILDIZ TEKNİK ÜNİVERSİTESİ
            </motion.h1>

            <motion.h2 initial={{ opacity: 0, y: 15, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-500 tracking-wide mt-2 sm:mt-4"
            >
              MATEMATİK MÜHENDİSLİĞİ
            </motion.h2>
          </div>

          <motion.div initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} transition={{ duration: 1.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-7xl mt-20 sm:block hidden"
          >
            <div className="relative">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Aramak için yazınız..."
                className="w-full py-3.25 px-5 pr-12 rounded-xl bg-white/95 text-xs sm:text-sm text-neutral-700 placeholder-neutral-400 outline-none shadow-lg shadow-black/20 focus:shadow-xl focus:shadow-black/30 transition-shadow duration-300"
              />
              <button className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors">
                <Search size={14} />
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-7xl px-4 -mt-20 sm:-mt-12">
        <div className="bg-white rounded-xl shadow-sm shadow-black/10 py-5 sm:py-6 px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-3 sm:gap-4">
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary-500/15 flex items-center justify-center">
                <stat.icon size={20} className="text-secondary-400 sm:w-6 sm:h-6" />
              </div>
              <div>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 + (index * 0.2) }}
                  className="text-lg sm:text-xl font-bold text-primary-600"
                >
                  <CountUp value={stat.value} suffix={stat.suffix} delay={1} />
                </motion.p>
                <p className="text-[11px] sm:text-xs text-neutral-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}