"use client";

import { ExternalLink, Info } from "lucide-react";
import { EditableList, EditableRegion, useCmsBlock } from "inscribed";

import PageSection from "@/app/components/PageSection";
import Panel from "@/app/components/Panel";
import StatStrip from "@/app/components/StatStrip";
import { safeHref, isExternalHref } from "@/lib/href";

function TrackLink({ value }) {
  const href = safeHref(value?.href);
  if (!href || !value?.label) return null;
  const external = isExternalHref(href);

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary-500/4 hover:bg-secondary-500/10 text-[12px] text-primary-500 hover:text-secondary-700 transition-colors"
    >
      {value.label}
      <ExternalLink className="size-3 text-primary-500/70 group-hover:text-secondary-700 transition-colors" />
    </a>
  );
}

function ProgramCard({ program }) {
  const hasAdmission = program.admissionScores || program.admissionFields;

  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border border-primary-500/10 shadow-xs bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[14px] font-semibold text-primary-500">{program.title}</span>
        <div className="flex items-center gap-x-3 gap-y-1 text-[11px] text-primary-500/70">
          <span>{program.duration}</span>
          <span>{program.akts}</span>
        </div>
      </div>

      <p className="text-[13px] text-primary-500/70 leading-relaxed">{program.description}</p>

      {hasAdmission && (
        <div className="flex flex-col gap-1 p-3 rounded-lg bg-primary-500/2 text-[12px] text-primary-500/70">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-500/70">
            Başvuru Koşulları
          </span>
          {program.admissionScores && <span>{program.admissionScores}</span>}
          {program.admissionFields && <span>İlgili alan: {program.admissionFields}</span>}
        </div>
      )}

      <div className="flex items-center gap-2">
        <TrackLink value={program.trackTr} />
        <TrackLink value={program.trackEn} />
      </div>
    </div>
  );
}

function aktsValue(raw) {
  const text = String(raw ?? "").trim();
  const match = /^([\d.,]+)\s*(.*)$/.exec(text);
  if (!match) return text;
  const [, amount, unit] = match;
  if (!unit) return amount;
  return (
    <>
      {amount}
      <span className="ml-1 text-[12px] font-semibold text-white/55">{unit}</span>
    </>
  );
}

export function ProgramList() {
  const { value } = useCmsBlock("programs.items");
  const programs = Array.isArray(value) ? value : [];
  const stats = programs.map((program) => ({
    value: aktsValue(program.akts),
    label: String(program.title ?? "").split(" (")[0],
    hint: program.duration,
  }));

  return (
    <>
      {stats.length > 0 && <StatStrip items={stats} />}

      <PageSection
        title={
          <EditableRegion
            blockPath="programs.title"
            blockType="ShortText"
            defaultValue="Lisansüstü Programlar"
          />
        }
        count={programs.length}
      >
        <EditableList
          blockPath="programs.items"
          as="div"
          className="flex flex-col gap-3"
          style={{ display: "flex" }}
          itemSchema={{
            title: { blockType: "ShortText", defaultValue: "" },
            duration: { blockType: "ShortText", defaultValue: "" },
            akts: { blockType: "ShortText", defaultValue: "" },
            description: { blockType: "LongText", defaultValue: "" },
            trackTr: { blockType: "Link", defaultValue: { href: "", label: "" } },
            trackEn: { blockType: "Link", defaultValue: { href: "", label: "" } },
            admissionScores: { blockType: "ShortText", defaultValue: "" },
            admissionFields: { blockType: "ShortText", defaultValue: "" },
          }}
          defaultValue={[
            {
              title: "Tezli Yüksek Lisans",
              duration: "2 yıl (4 yarıyıl)",
              akts: "120 AKTS",
              description:
                "Temel ve uygulamalı matematik bilgisiyle, öğrencinin bilimsel araştırma yaparak bilgiye erişme, bilgiyi değerlendirme ve yorumlama yeteneğini kazanmasını sağlamaktır.",
              trackTr: {
                href: "https://bologna.yildiz.edu.tr/index.php?r=program/view&id=180&aid=86",
                label: "Türkçe",
              },
              trackEn: {
                href: "https://bologna.yildiz.edu.tr/index.php?r=program/view&id=181&aid=86",
                label: "İngilizce",
              },
              admissionScores: "",
              admissionFields: "",
            },
            {
              title: "Tezsiz Yüksek Lisans (2. Öğretim)",
              duration: "1 yıl",
              akts: "92,5 AKTS",
              description:
                "Disiplinlerarası bir program olarak kurulması hedeflenen Matematik Mühendisliği 2. Öğretim Tezsiz Yüksek Lisans Programı, farklı disiplinlerden gelen profesyonellerin mühendislik, ekonomi, bilişim ve hizmet sektörlerinde etkin rol alabilmesini hedefler.",
              trackTr: {
                href: "https://bologna.yildiz.edu.tr/index.php?r=program/view&id=224&aid=86",
                label: "Türkçe",
              },
              trackEn: {
                href: "https://bologna.yildiz.edu.tr/index.php?r=program/view&id=225&aid=86",
                label: "İngilizce",
              },
              admissionScores: "",
              admissionFields: "",
            },
            {
              title: "Doktora",
              duration: "4 yıl (8 yarıyıl)",
              akts: "240 AKTS",
              description:
                "Öğrenciye bağımsız araştırma yapma, bilimsel olayları geniş ve derin bir bakış açısıyla irdeleyerek yorum yapabilme ve yeni sentezlere ulaşmak için gerekli adımları belirleme yeteneği kazandırmaktır.",
              trackTr: {
                href: "https://bologna.yildiz.edu.tr/index.php?r=program/view&id=184&aid=24",
                label: "Türkçe",
              },
              trackEn: {
                href: "https://bologna.yildiz.edu.tr/index.php?r=program/view&id=226&aid=24",
                label: "İngilizce",
              },
              admissionScores: "ALES (sayısal) en az 55 · Yabancı dil en az 55",
              admissionFields:
                "Bilgisayar Mühendisliği, Endüstri Mühendisliği, Matematik Mühendisliği",
            },
          ]}
        >
          {(item, index) => <ProgramCard key={index} program={item} />}
        </EditableList>
      </PageSection>
    </>
  );
}

export function FbeSection() {
  return (
    <PageSection
      title={
        <EditableRegion
          blockPath="fbe.title"
          blockType="ShortText"
          defaultValue="Fen Bilimleri Enstitüsü"
        />
      }
    >
      <Panel>
        <div className="flex flex-col gap-3">
          <EditableRegion
            blockPath="fbe.body"
            blockType="LongText"
            defaultValue="Lisansüstü programlar Fen Bilimleri Enstitüsü bünyesinde yürütülür. Başvuru, kayıt ve akademik takvim bilgileri enstitünün kendi sayfasından takip edilir."
            as="p"
            className="text-[13px] text-primary-500/70 leading-relaxed"
          />
          <EditableList
            blockPath="fbe.items"
            as="div"
            className="flex flex-col gap-2"
            style={{ display: "flex" }}
            itemSchema={{
              link: { blockType: "Link", defaultValue: { href: "", label: "" } },
            }}
            defaultValue={[
              {
                link: {
                  href: "https://fbe.yildiz.edu.tr/lisansustu-programlar",
                  label: "FBE Lisansüstü Programlar",
                },
              },
              {
                link: {
                  href: "https://fbe.yildiz.edu.tr/iletisim/program-iletisim-bilgileri",
                  label: "Program İletişim Bilgileri",
                },
              },
            ]}
          >
            {(item, index) => {
              const href = safeHref(item.link?.href);
              const external = isExternalHref(href);
              return (
                <a
                  key={index}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-2 p-2.5 rounded-lg bg-primary-500/2 border border-primary-500/5 hover:border-secondary-500/30 transition-colors"
                >
                  <Info className="size-3.5 shrink-0 text-secondary-700" />
                  <span className="flex-1 text-[13px] text-primary-500">{item.link?.label}</span>
                  <ExternalLink className="size-3 shrink-0 text-primary-500/70 group-hover:text-secondary-700 transition-colors" />
                </a>
              );
            }}
          </EditableList>
        </div>
      </Panel>
    </PageSection>
  );
}
