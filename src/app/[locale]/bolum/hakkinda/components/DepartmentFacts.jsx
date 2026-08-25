"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useInView, animate } from "framer-motion";
import { Users, FlaskConical, BookOpen, Languages, Briefcase } from "lucide-react";

import MainCard from "@/app/components/MainCard";
import { useReducedMotion } from "@/app/components/Landing/components/heroMotion";

function CountUp({ value, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();

  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;

    if (reducedMotion) {
      motionVal.set(value);
      return;
    }

    let controls;
    const timeout = setTimeout(() => {
      controls = animate(motionVal, value, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      controls?.stop();
    };
  }, [inView, reducedMotion, motionVal, value, delay]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
    </span>
  );
}

export default function DepartmentFacts({ staff, curriculum }) {
  const facts = [
    {
      icon: Users,
      value: staff.faculty,
      label: "Öğretim Üyesi",
      sub: `${staff.professor} profesör · ${staff.associate} doçent · ${staff.assistant} dr. öğr. üyesi`,
    },
    {
      icon: FlaskConical,
      value: staff.research,
      label: "Araştırma Görevlisi",
      sub: "Öğretim ve araştırma kadrosu",
    },
    {
      icon: BookOpen,
      value: curriculum.totalEcts,
      label: "AKTS",
      sub: `${curriculum.termCount} yarıyıl · ${curriculum.courseCount} ders`,
    },
    {
      icon: Languages,
      value: 2,
      label: "Lisans Programı",
      sub: "%100 ve %30 İngilizce",
    },
    {
      icon: Briefcase,
      value: 40,
      label: "İş Günü Staj",
      sub: "Mezuniyet için zorunlu",
    },
  ];

  return (
    <div className="mb-8">
      <MainCard title="Sayılarla Bölüm" dark>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4 lg:grid-cols-5">
          {facts.map((fact, index) => {
            const Icon = fact.icon;
            return (
              <div key={fact.label} className="flex items-baseline gap-2.5">
                <span className="flex size-6 shrink-0 translate-y-1 items-center justify-center rounded-md bg-secondary-500/12">
                  <Icon size={13} strokeWidth={1.5} className="text-secondary-500" />
                </span>
                <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 sm:block">
                  <span className="font-mono text-base font-semibold leading-none text-secondary-500 sm:text-xl">
                    <CountUp value={fact.value} delay={0.2 + index * 0.1} />
                  </span>
                  <span className="text-[11px] font-medium tracking-wide text-white/60 sm:mt-1 sm:block">
                    {fact.label}
                  </span>
                  <span className="text-[10px] leading-snug text-white/60 sm:mt-0.5 sm:block">
                    {fact.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </MainCard>
    </div>
  );
}
