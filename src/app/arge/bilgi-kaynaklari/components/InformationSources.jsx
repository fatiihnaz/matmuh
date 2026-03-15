'use client'

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { informationSources } from "@/data/informationsources";

const staggerContainer = {
  visible: { 
    transition: { 
      staggerChildren: 0.04,
      delayChildren: 0.05 
    } 
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.8, 0.25, 1] } 
  }
};

export default function InformationSources() {
  const groupedSources = useMemo(() => {
    return informationSources.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-14">
        {Object.entries(groupedSources).map(([category, items]) => (
          <section key={category} className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-5 bg-secondary-500 rounded-xl shadow-[0_0_10px_rgba(var(--secondary-500-rgb),0.3)]" />
                <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-primary-800">
                  {category}
                </h3>
                <span className="flex items-center justify-center px-2 py-0.5 rounded-xl bg-primary-500/5 text-[10px] font-bold text-primary-500/50">
                  {items.length}
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent" />
            </div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5"
            >
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.id} variants={staggerItem}>
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-between p-3.5 bg-white rounded-xl border border-primary-500/10 shadow-sm hover:shadow-lg hover:shadow-secondary-500/5 hover:border-secondary-500/30 hover:-translate-y-0.5 transition-all duration-300 min-h-[72px] overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="flex items-center gap-3.5 z-10 overflow-hidden">
                        <div className="shrink-0 w-10 h-10 rounded-xl bg-primary-500/[0.04] border border-primary-500/5 flex items-center justify-center text-primary-500/50 group-hover:bg-secondary-500 group-hover:border-secondary-500 group-hover:text-white group-hover:scale-100 transition-all duration-300">
                          <Icon size={18} strokeWidth={1.5} />
                        </div>
                        
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="text-[13px] font-semibold text-primary-900/85 group-hover:text-secondary-600 leading-snug transition-colors duration-300 line-clamp-2">
                            {item.label}
                          </span>
                        </div>
                      </div>
                      
                      <div className="shrink-0 pl-1 z-10 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <div className="w-7 h-7 rounded-xl bg-secondary-500/10 flex items-center justify-center text-secondary-500 group-hover:bg-secondary-500 group-hover:text-white transition-colors duration-300">
                          <ArrowUpRight size={14} strokeWidth={2} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>
        ))}
      </div>
    </div>
  );
}