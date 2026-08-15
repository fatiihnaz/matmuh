"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useInView,
  animate,
} from "framer-motion";
import { Users, GraduationCap, BookOpen, FlaskConical } from "lucide-react";
import Hero from "./components/Hero";
import { useReducedMotion } from "./components/heroMotion";
import { EditableList } from "inscribed";

// Icons stay in code (not content); list items map to them by index.
const STAT_ICONS = [Users, GraduationCap, BookOpen, FlaskConical];

function CountUp({ value, suffix, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();

  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!inView) return;

    if (reducedMotion) {
      motionVal.set(value);
      return;
    }

    let controls;
    const timeout = setTimeout(() => {
      controls = animate(motionVal, value, {
        duration: 2.5,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => setIsFinished(true),
      });
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      controls?.stop();
    };
  }, [inView, reducedMotion, motionVal, value, delay]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isFinished || reducedMotion ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeInOut" }}
        >
          {suffix}
        </motion.span>
      )}
    </span>
  );
}

export default function Landing() {
  return (
    <div className="relative">
      <Hero/>

      <div className="relative z-10 mx-auto max-w-7xl px-4 -mt-20 sm:-mt-12">
        <div className="bg-white rounded-xl border border-primary-500/10 shadow-xs shadow-black/10 grid grid-cols-2 md:grid-cols-4 overflow-hidden">
          <EditableList
            blockPath="home.stats"
            itemSchema={{
              value: { blockType: "ShortText", defaultValue: "0" },
              suffix: { blockType: "ShortText", defaultValue: "" },
              label: { blockType: "ShortText", defaultValue: "" },
            }}
            defaultValue={[
              { value: "32", suffix: "", label: "Akademik Kadro" },
              { value: "450", suffix: "+", label: "Aktif Öğrenci" },
              { value: "85", suffix: "+", label: "Yayın / Yıl" },
              { value: "4", suffix: "", label: "Araştırma Grubu" },
            ]}
          >
            {(item, index) => {
              const Icon = STAT_ICONS[index] ?? STAT_ICONS[0];
              return (
                <div
                  className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-6 border-black/4 ${
                    index % 2 === 0 ? "border-r" : ""
                  } ${index < 2 ? "border-b" : ""} md:border-b-0 ${
                    index < 3 ? "md:border-r" : "md:border-r-0"
                  }`}
                >
                  <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary-500/15 flex items-center justify-center">
                    <Icon size={20} className="text-secondary-400 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 + (index * 0.2) }}
                      className="text-lg sm:text-xl font-bold text-primary-600"
                    >
                      <CountUp value={Number(item.value) || 0} suffix={item.suffix} delay={1} />
                    </motion.p>
                    <p className="text-[11px] sm:text-xs text-neutral-500">{item.label}</p>
                  </div>
                </div>
              );
            }}
          </EditableList>
        </div>
      </div>
    </div>
  );
}