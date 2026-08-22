"use client";

import { createElement, Fragment } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Award, BookOpen, Briefcase, Building2, ContactRound, Database, Earth, Euro, ExternalLink, FileText, Flag, Globe, GraduationCap, History, Landmark, Languages, Library, Link as LinkIcon, MapPin, Network, Scale, School, Search, SearchCode, ShieldCheck, Twitter, UserPlus, Users, Wallet } from "lucide-react";
import { EditableList, useCmsBlock } from "inscribed";

import { safeHref, isExternalHref } from "@/lib/href";

const ICONS = {
  "award": Award,
  "book-open": BookOpen,
  "briefcase": Briefcase,
  "building-2": Building2,
  "contact-round": ContactRound,
  "database": Database,
  "earth": Earth,
  "euro": Euro,
  "external-link": ExternalLink,
  "file-text": FileText,
  "flag": Flag,
  "globe": Globe,
  "graduation-cap": GraduationCap,
  "history": History,
  "landmark": Landmark,
  "languages": Languages,
  "library": Library,
  "link": LinkIcon,
  "map-pin": MapPin,
  "network": Network,
  "scale": Scale,
  "school": School,
  "search": Search,
  "search-code": SearchCode,
  "shield-check": ShieldCheck,
  "twitter": Twitter,
  "user-plus": UserPlus,
  "users": Users,
  "wallet": Wallet,
};

function icon(key, size) {
  return createElement(ICONS[key] ?? LinkIcon, { size, strokeWidth: 1.5 });
}

const GRID =
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5";

function CategoryHeading({ label, count }) {
  return (
    <div className="col-span-full flex items-center gap-4 mt-11 first:mt-0">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-5 bg-secondary-500 rounded-xl" />
        <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-primary-800">
          {label}
        </h3>
        <span className="flex items-center justify-center px-2 py-0.5 rounded-xl bg-primary-500/5 text-[10px] font-bold text-primary-500/50">
          {count}
        </span>
      </div>
      <div className="h-px flex-1 bg-linear-to-r from-primary-500/10 via-primary-500/5 to-transparent" />
    </div>
  );
}

function SourceCard({ item, index }) {
  const href = safeHref(item.link?.href);
  const external = isExternalHref(href);

  return (
    <motion.a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.04, ease: [0.25, 0.8, 0.25, 1] }}
      className="group relative flex items-center justify-between p-3.5 bg-white rounded-xl border border-primary-500/10 shadow-sm hover:shadow-lg hover:shadow-secondary-500/5 hover:border-secondary-500/30 hover:-translate-y-0.5 transition-all duration-300 min-h-18 overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-br from-secondary-500/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-center gap-3.5 z-10 overflow-hidden">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-primary-500/4 border border-primary-500/5 flex items-center justify-center text-primary-500/50 group-hover:bg-secondary-500 group-hover:border-secondary-500 group-hover:text-white transition-all duration-300">
          {icon(item.icon, 18)}
        </div>

        <div className="flex flex-col min-w-0 pr-2">
          <span className="text-[13px] font-semibold text-primary-900/85 group-hover:text-secondary-600 leading-snug transition-colors duration-300 line-clamp-2">
            {item.link?.label}
          </span>
        </div>
      </div>

      <div className="shrink-0 pl-1 z-10 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <div className="w-7 h-7 rounded-xl bg-secondary-500/10 flex items-center justify-center text-secondary-500 group-hover:bg-secondary-500 group-hover:text-white transition-colors duration-300">
          <ArrowUpRight size={14} strokeWidth={2} />
        </div>
      </div>
    </motion.a>
  );
}

export default function InformationSources() {
  const { value } = useCmsBlock("sources.items");
  const items = Array.isArray(value) ? value : [];
  const counts = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <EditableList
        blockPath="sources.items"
        as="div"
        className={GRID}
        style={{ display: "grid" }}
        itemSchema={{
          category: { blockType: "ShortText", defaultValue: "" },
          link: { blockType: "Link", defaultValue: { href: "", label: "" } },
          icon: { blockType: "ShortText", defaultValue: "" },
        }}
        defaultValue={[
        { category: "Akademik", link: { href: "http://tez2.yok.gov.tr/", label: "YÖK Tez Tarama" }, icon: "search" },
        { category: "Akademik", link: { href: "http://www.ktp.yildiz.edu.tr/", label: "YTÜ Kütüphane" }, icon: "library" },
        { category: "Akademik", link: { href: "http://www.sciencedirect.com/", label: "Sciencedirect" }, icon: "book-open" },
        { category: "Akademik", link: { href: "http://www.springerlink.com/", label: "Springerlink" }, icon: "external-link" },
        { category: "Erasmus", link: { href: "http://www.europa.eu.int/comm/education/erasmus.html", label: "Erasmus+" }, icon: "globe" },
        { category: "Resmi Kurumlar", link: { href: "http://www.mfa.gov.tr/yerlesik-diplomatik-ve-konsuler-misyonlar.tr.mfa", label: "Elçilikler ve Konsolosluklar" }, icon: "building-2" },
        { category: "Eğitim", link: { href: "http://www.europa.eu.int/comm/education/socrates/ects.html", label: "Avrupa Kredi Transfer Sistemi (ECTS)" }, icon: "graduation-cap" },
        { category: "Eğitim", link: { href: "http://www.europa.eu.int/comm/education/ilpc/index_en.html", label: "Intensive Language Program (ILPC)" }, icon: "languages" },
        { category: "Erasmus", link: { href: "http://www.esn.org/", label: "Erasmus Student Network" }, icon: "users" },
        { category: "Erasmus", link: { href: "http://www.erasmus.ac.uk/", label: "UK Socrates-Erasmus Council" }, icon: "map-pin" },
        { category: "Birlikler", link: { href: "http://www.eua.org/", label: "European University Association (EUA)" }, icon: "school" },
        { category: "Birlikler", link: { href: "http://www.eaie.org/", label: "Int. Education Association (EAIE)" }, icon: "earth" },
        { category: "Birlikler", link: { href: "http://www.enqa.net/", label: "Quality Assurance (ENQA)" }, icon: "shield-check" },
        { category: "Araçlar", link: { href: "http://partbase.eupro.se/", label: "Partbase Partner Finding Tool" }, icon: "user-plus" },
        { category: "Araçlar", link: { href: "http://www.siu.no/socpart", label: "Norveç Ulusal Ajansı Ortak Bulma" }, icon: "database" },
        { category: "Birlikler", link: { href: "http://eunbrux02.eun.org/portal/index-en.cfm", label: "European Schoolnet" }, icon: "network" },
        { category: "Resmi Kurumlar", link: { href: "http://www.yok.gov.tr/", label: "Yüksek Öğretim Kurumu (YÖK)" }, icon: "landmark" },
        { category: "Resmi Kurumlar", link: { href: "http://www.mfa.gov.tr/default.tr.mfa", label: "Dışişleri Bakanlığı" }, icon: "flag" },
        { category: "Resmi Kurumlar", link: { href: "http://www.abgs.gov.tr/", label: "AB Genel Sekreterliği" }, icon: "briefcase" },
        { category: "Resmi Kurumlar", link: { href: "http://www.ua.gov.tr/", label: "Ulusal Ajans" }, icon: "award" },
        { category: "Sosyal Medya", link: { href: "http://twitter.com/ulusalajans", label: "Ulusal Ajans Twitter" }, icon: "twitter" },
        { category: "Araçlar", link: { href: "http://partnersearch.ua.gov.tr/", label: "Ortak Arama Portalı" }, icon: "search-code" },
        { category: "Burslar", link: { href: "http://www.jeanmonnet.org.tr/web/", label: "Jean Monnet Burs Programı" }, icon: "history" },
        { category: "Resmi Kurumlar", link: { href: "http://www.cfcu.gov.tr/", label: "Merkezi Finans ve İhale Birimi" }, icon: "wallet" },
        { category: "Resmi Kurumlar", link: { href: "http://ec.europa.eu/education/index_en.htm", label: "European Commission" }, icon: "euro" },
        { category: "Resmi Kurumlar", link: { href: "http://www.coe.int/", label: "Council of Europe" }, icon: "scale" },
        { category: "Birlikler", link: { href: "http://www.iau-aiu.net/", label: "Int. Association of Universities" }, icon: "globe" },
        { category: "Birlikler", link: { href: "http://www.esib.org/", label: "European Students' Union" }, icon: "contact-round" },
        { category: "Araçlar", link: { href: "http://www.enic-naric.net/index.aspx?s=n&r=g&d=about", label: "ENIC - NARIC Networks" }, icon: "link" },
        { category: "Yayınlar", link: { href: "http://publications.europa.eu/", label: "EU Publications Portal" }, icon: "file-text" },
        ]}
      >
        {(item, index) => (
          <Fragment key={index}>
            {item.category !== items[index - 1]?.category && (
              <CategoryHeading
                label={item.category}
                count={counts[item.category] ?? 0}
              />
            )}
            <SourceCard item={item} index={index} />
          </Fragment>
        )}
      </EditableList>
    </div>
  );
}
