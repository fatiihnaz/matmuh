"use client";

import { EditableList, EditableRegion, useCmsBlock } from "inscribed";

import PageSection from "@/app/components/PageSection";
import Panel from "@/app/components/Panel";
import DocumentLink from "@/app/components/DocumentLink";
import { safeHref } from "@/lib/href";

function lines(text) {
  return String(text ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function Universities() {
  const { value } = useCmsBlock("universities.items");
  const items = Array.isArray(value) ? value : [];

  return (
    <PageSection
      title={
        <EditableRegion
          blockPath="universities.title"
          blockType="ShortText"
          defaultValue="Ders Alınabilecek Üniversiteler"
        />
      }
      count={items.length}
    >
      <Panel>
        <EditableList
          blockPath="universities.items"
          as="div"
          className="flex flex-wrap gap-2"
          style={{ display: "flex" }}
          itemSchema={{
            name: { blockType: "ShortText", defaultValue: "" },
          }}
          defaultValue={[
            { name: "İstanbul Teknik Üniversitesi" },
            { name: "Orta Doğu Teknik Üniversitesi" },
            { name: "Boğaziçi Üniversitesi" },
            { name: "İstanbul Üniversitesi" },
            { name: "Marmara Üniversitesi" },
          ]}
        >
          {(item, index) => (
            <span
              key={index}
              className="px-3 py-1.5 rounded-lg bg-primary-500/2 border border-primary-500/5 text-[13px] text-primary-500"
            >
              {item.name}
            </span>
          )}
        </EditableList>
      </Panel>
    </PageSection>
  );
}

export function ApprovalPaths() {
  return (
    <PageSection
      title={
        <EditableRegion
          blockPath="paths.title"
          blockType="ShortText"
          defaultValue="Hangi Yolu İzleyeceksin"
        />
      }
    >
      <EditableList
        blockPath="paths.items"
        as="div"
        className="grid grid-cols-1 lg:grid-cols-2 gap-3"
        style={{ display: "grid" }}
        itemSchema={{
          label: { blockType: "ShortText", defaultValue: "" },
          summary: { blockType: "ShortText", defaultValue: "" },
          steps: { blockType: "LongText", defaultValue: "" },
        }}
        defaultValue={[
          {
            label: "Ders listede varsa",
            summary: "Dilekçe gerekmez.",
            steps:
              "Almak istediğin dersin, yaz okulunda ders alınabilecek üniversiteler tarafından açıldığını doğrula.\nDersin “Diğer Üniversitelerden Alınabilir Dersler Listesi”nde yer aldığını kontrol et.\nDoğrudan karşı üniversiteye kayıt yaptır.",
          },
          {
            label: "Ders listede yoksa",
            summary: "Öğretim üyesinden uygunluk alınması gerekir.",
            steps:
              "Listede adı belirtilen ilgili öğretim üyesinden dersin içerik uygunluğunu al.\nDilekçeyi doldur.\nDilekçeyi ve uygunluk yazısını Bölüm Öğrenci İşleri’ne teslim et.",
          },
        ]}
      >
        {(item, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 p-5 rounded-xl border border-primary-500/10 shadow-xs bg-white"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-semibold text-primary-500">{item.label}</span>
              <span className="text-[12px] text-secondary-600 font-medium">{item.summary}</span>
            </div>
            <ol className="flex flex-col gap-2">
              {lines(item.steps).map((step, stepIndex) => (
                <li key={stepIndex} className="flex gap-3">
                  <span className="shrink-0 flex items-center justify-center size-5 rounded-sm bg-secondary-500/15 text-[10px] font-semibold text-secondary-600">
                    {stepIndex + 1}
                  </span>
                  <span className="text-[13px] text-primary-500/60 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </EditableList>
    </PageSection>
  );
}

export function Equivalence() {
  return (
    <PageSection
      title={
        <EditableRegion
          blockPath="equivalence.title"
          blockType="ShortText"
          defaultValue="Ders İçerik Uygunluğu"
        />
      }
    >
      <Panel>
        <div className="flex flex-col gap-4">
          <EditableRegion
            blockPath="equivalence.body"
            blockType="LongText"
            defaultValue="Başka bölümden ders alma veya yaz okulunda başka üniversiteden ders alma durumunda, saydırmak istediğin ders için listede belirtilen öğretim üyesinden uygunluk alınması zorunludur. Uygunluk, kurumsal e-posta adresi üzerinden ya da ders içerik çıktılarının üzerine yazılıp imzalanarak alınabilir. Uygunluk yazısında eşleşme net biçimde ifade edilmelidir."
            as="p"
            className="text-[13px] text-primary-500/60 leading-relaxed"
          />

          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-500/45">
              Örnek ifadeler
            </span>
            <EditableList
              blockPath="equivalence.examples"
              as="div"
              className="flex flex-col gap-3"
              style={{ display: "flex" }}
              itemSchema={{
                context: { blockType: "ShortText", defaultValue: "" },
                text: { blockType: "LongText", defaultValue: "" },
              }}
              defaultValue={[
                {
                  context: "Bölüm içi ders saydırma",
                  text: "MTM3512 Kompleks Analiz 1 dersinin içeriği MAT4111 Kompleks Fonksiyonlar Teorisi 1 dersi ile içerik yönünden %75 uygundur.",
                },
                {
                  context: "Başka üniversiteden ders saydırma",
                  text: "MTM2552 İntegral Denklemler dersinin İstanbul Teknik Üniversitesinin MAT 447/E İntegral Denklemler dersi ile yerel kredisinin en az %65’i, ders içeriğinin ise %75’i uyumludur.",
                },
              ]}
            >
              {(item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-1.5 p-3 rounded-lg bg-primary-500/2 border-l-2 border-secondary-500/40"
                >
                  <span className="text-[11px] font-medium text-primary-500/45">
                    {item.context}
                  </span>
                  <span className="text-[13px] text-primary-500/70 leading-relaxed italic">
                    “{item.text}”
                  </span>
                </div>
              )}
            </EditableList>
          </div>
        </div>
      </Panel>
    </PageSection>
  );
}

export function SummerDocuments() {
  const { value } = useCmsBlock("documents.items");
  const items = Array.isArray(value) ? value : [];

  return (
    <PageSection
      title={
        <EditableRegion
          blockPath="documents.title"
          blockType="ShortText"
          defaultValue="Belgeler"
        />
      }
      count={items.length}
    >
      <Panel>
        <EditableList
          blockPath="documents.items"
          as="div"
          className="grid grid-cols-1 xl:grid-cols-2 gap-2"
          style={{ display: "grid" }}
          itemSchema={{
            file: { blockType: "Link", defaultValue: { href: "", label: "" } },
            kind: { blockType: "ShortText", defaultValue: "pdf" },
            term: { blockType: "ShortText", defaultValue: "" },
            size: { blockType: "ShortText", defaultValue: "" },
          }}
          defaultValue={[
            {
              file: {
                href: "https://mtm.yildiz.edu.tr/media/files/YAZ%20OKULU%20D%C4%B0%C4%9EER%20%C3%9CN%C4%B0VERS%C4%B0TELERDEN%20ALINAB%C4%B0L%C4%B0R%20DERSLER%C4%B0N%20L%C4%B0STES%C4%B0%202025-2026(1).pdf",
                label: "Diğer Üniversitelerden Alınabilir Dersler Listesi",
              },
              kind: "pdf",
              term: "2025-2026",
              size: "",
            },
            {
              file: {
                href: "https://mtm.yildiz.edu.tr/media/files/Ders%20%C4%B0%C3%A7erik%20Uygunlu%C4%9Fu%20Al%C4%B1nmas%C4%B1%20Gereken%20%C3%96%C4%9Fretim%20%C3%9Cyesi%20Listesi_.pdf",
                label: "Ders İçerik Uygunluğu Alınması Gereken Öğretim Üyesi Listesi",
              },
              kind: "pdf",
              term: "",
              size: "171552",
            },
            {
              file: {
                href: "https://mtm.yildiz.edu.tr/media/files/BA%C5%9EKA%20%C3%9CN%C4%B0VERS%C4%B0TEDEN%20YAZ%20OKULU%20DERS%20ALMA%20D%C4%B0LEK%C3%87E_2025-2026.docx",
                label: "Başka Üniversiteden Yaz Okulu Ders Alma Dilekçesi",
              },
              kind: "docx",
              term: "2025-2026",
              size: "",
            },
            {
              file: {
                href: "https://kalite.yildiz.edu.tr/media/files/YO%CC%88-097-YTU%CC%88%20Es%CC%A7deg%CC%86erlik%20ve%20I%CC%87ntibak%20I%CC%87s%CC%A7lemleri%20Yo%CC%88nergesi.doc",
                label: "YÖ-097 YTÜ Eşdeğerlik ve İntibak İşlemleri Yönergesi",
              },
              kind: "doc",
              term: "",
              size: "176128",
            },
          ]}
        >
          {(item, index) => (
            <DocumentLink
              key={index}
              label={item.file?.label}
              href={safeHref(item.file?.href)}
              kind={item.kind}
              term={item.term || undefined}
              size={Number(item.size) || 0}
            />
          )}
        </EditableList>
      </Panel>
    </PageSection>
  );
}
