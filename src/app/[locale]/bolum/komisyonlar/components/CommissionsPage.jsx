"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { EditableList, EditableRegion, useCmsBlock } from "inscribed";

import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import Panel from "@/app/components/Panel";
import PageSection from "@/app/components/PageSection";
import Avatar from "@/app/components/Avatar";
import DocumentLink from "@/app/components/DocumentLink";
import { safeHref } from "@/lib/href";

const TITLE_TAIL = new Set(["Üyesi"]);

function personName(text) {
  const parts = String(text ?? "").trim().split(/\s+/);
  let i = 0;
  while (i < parts.length - 1 && (parts[i].endsWith(".") || TITLE_TAIL.has(parts[i]))) i += 1;
  return parts.slice(i).join(" ");
}

function parseMembers(text) {
  return String(text ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, tag] = line.split("|").map((part) => part.trim());
      return { label, tag: tag || null };
    });
}

function CommissionCard({ commission }) {
  const [open, setOpen] = useState(false);
  const members = parseMembers(commission.members);
  const chair = commission.chair?.trim();
  const total = members.length + (chair ? 1 : 0);

  return (
    <div className="rounded-lg border border-primary-500/5 bg-primary-500/2 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-primary-500/3 transition-colors"
      >
        {chair && <Avatar name={personName(chair)} size="size-8" textSize="text-[10px]" />}
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-semibold text-primary-500 leading-snug">
            {commission.name}
          </span>
          <span className="block text-[11px] text-primary-500/45 wrap-break-word">
            {chair ? chair : `${total} üye`}
          </span>
        </span>
        <span className="shrink-0 text-[10px] text-primary-500/35">{total}</span>
        <ChevronDown
          className={`shrink-0 size-4 text-primary-500/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 flex flex-col gap-2 border-t border-primary-500/5">
          {members.map((member, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <Avatar name={personName(member.label)} idx={idx + 1} size="size-7" textSize="text-[9px]" />
              <span className="text-[12px] text-primary-500/70 leading-snug">
                {member.label}
                {member.tag && (
                  <span className="ml-1.5 text-[10px] font-medium text-secondary-500">
                    {member.tag}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommissionList() {
  const { value } = useCmsBlock("commissions.items");
  const count = Array.isArray(value) ? value.length : 0;

  return (
    <PageSection
      title={
        <EditableRegion
          blockPath="commissions.title"
          blockType="ShortText"
          defaultValue="Bölüm Komisyonları"
        />
      }
      count={count}
    >
      <EditableList
        blockPath="commissions.items"
        as="div"
        className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start"
        style={{ display: "grid" }}
        itemSchema={{
          name: { blockType: "ShortText", defaultValue: "" },
          chair: { blockType: "ShortText", defaultValue: "" },
          members: { blockType: "LongText", defaultValue: "" },
        }}
        defaultValue={[
            { name: "Bilişim ve İletişim Komisyonu", chair: "Prof. Dr. Hale Köçken", members: "Doç. Dr. Arzu Turan Dincel\nDoç. Dr. Mert Bal\nAraş. Gör. Kaan Kemal Polat" },
            { name: "Akademik Teşvik ve Değerlendirme Komisyonu", chair: "Prof. Dr. Fatih Taşçı", members: "Prof. Dr. Nazmiye Yahnioğlu\nProf. Dr. Kevser Özden Köklü\nDoç. Dr. Müslüm Özışık\nDoç. Dr. Nilgün Güler Bayazıt" },
            { name: "Eğitim-Öğretim ve Akreditasyon Komisyonu", chair: "Prof. Dr. Fatma İnci Albayrak", members: "Doç. Dr. Serkan Onar\nDoç. Dr. Gökhan Göksu\nDoç. Dr. Birol Aslanyürek | Bologna Koordinatörü" },
            { name: "İntibak ve Önceden Kazanılmış Yeterliliklerin Tanınması Komisyonu", chair: "Doç. Dr. Müslüm Özışık", members: "Doç. Dr. Yasemen Uçan\nDr. Öğr. Üyesi Derya Sekman\nAraş. Gör. Dr. Hayati Ünsal Özer\nDoç. Dr. Bayram Ali İbrahimoğlu | Önceden Kazanılmış Yet. Tanınması Sorumlusu" },
            { name: "Bitirme Çalışması Komisyonu", chair: "Prof. Dr. İbrahim Emiroğlu", members: "Prof. Dr. Coşkun Güler" },
            { name: "Stratejik Planlama Komisyonu", chair: "Doç. Dr. Ramazan Tekercioğlu", members: "Araş. Gör. Handenur Esen\nDoç. Dr. Ramazan Tekercioğlu | Yıllık Faaliyet Sorumlusu" },
            { name: "Kalite Komisyonu", chair: "Prof. Dr. Reşat Köşker", members: "Doç. Dr. Ülkü Babuşcu Yeşil\nAraş. Gör. İsmail Önder\nArş. Gör. Metehan Turan" },
            { name: "Laboratuvar, İş Sağlığı ve Güvenliği Komisyonu", chair: "Prof. Dr. Nazmiye Yahnioğlu", members: "Öğr. Gör. Abdulkadir Şahiner" },
            { name: "Anket Hazırlama ve Değerlendirme Komisyonu", chair: "Prof. Dr. Fatma Aydın Akgün", members: "Doç. Dr. Melih Çınar" },
            { name: "Sosyal Aktiviteler ve Mezunlarla İlişkiler Komisyonu", chair: "Prof. Dr. Ayla Şaylı", members: "Doç. Dr. Kadriye Şimşek Alan\nAraş. Gör. Handenur Esen" },
            { name: "Uluslararası İlişkiler ve Değişim Programları Komisyonu", chair: "Doç. Dr. Nilgün Güler Bayazıt", members: "Dr. Öğr. Üyesi Seda Göktepe Körpeoğlu\nDr. Öğr. Üyesi Fatih Aylıkcı\nAraş. Gör. Emel Uğurlu\nAraş. Gör. Buse Güler" },
            { name: "Endüstriyel İlişkiler ve Staj Komisyonu", chair: "Prof. Dr. Hülya Serab", members: "Öğr. Gör. Abdulkadir Şahiner | 1. Staj\nAraş. Gör. İsmail Önder | 1. Staj\nAraş. Gör. Dr. Hayati Ünsal Özer | 1. Staj\nAraş. Gör. Buse Güler | 1. Staj\nAraş. Gör. Emel Uğurlu | 2. Staj\nAraş. Gör. Kaan Kemal Polat | 2. Staj\nArş. Gör. Metehan Turan | 2. Staj" },
        ]}
      >
        {(item, index) => <CommissionCard key={index} commission={item} />}
      </EditableList>
    </PageSection>
  );
}

function CommissionDocuments() {
  return (
    <EditableList
      blockPath="documents.items"
      as="div"
      className="flex flex-col gap-2"
      style={{ display: "flex" }}
      itemSchema={{
        file: { blockType: "Link", defaultValue: { href: "", label: "" } },
        kind: { blockType: "ShortText", defaultValue: "pdf" },
        size: { blockType: "ShortText", defaultValue: "" },
      }}
      defaultValue={[
        {
          file: {
            href: "https://mtm.yildiz.edu.tr/media/files/B%C3%96L%C3%9CM%20KOM%C4%B0SYONLARI%2019_11_2025(1).pdf",
            label: "Bölüm Komisyonları (19.11.2025)",
          },
          kind: "pdf",
          size: "76892",
        },
      ]}
    >
      {(item, index) => (
        <DocumentLink
          key={index}
          label={item.file?.label}
          href={safeHref(item.file?.href)}
          kind={item.kind}
          size={Number(item.size) || 0}
        />
      )}
    </EditableList>
  );
}

export default function CommissionsPage() {
  return (
    <>
      <SubHeader
        title={
          <EditableRegion
            blockPath="page.title"
            blockType="ShortText"
            defaultValue="Komisyonlar"
          />
        }
        subTitle={
          <EditableRegion
            blockPath="page.subtitle"
            blockType="ShortText"
            defaultValue="Bölüm komisyonları ve üyeleri · 19.11.2025"
          />
        }
      />
      <PageLayout>
        <div className="flex flex-col gap-8">
          <CommissionList />

          <PageSection
            title={
              <EditableRegion
                blockPath="documents.title"
                blockType="ShortText"
                defaultValue="Belgeler"
              />
            }
          >
            <Panel>
              <CommissionDocuments />
            </Panel>
          </PageSection>
        </div>
      </PageLayout>
    </>
  );
}
