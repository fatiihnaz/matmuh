"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { EditableList, EditableRegion } from "inscribed";

import MainCard from "@/app/components/MainCard";
import Collapse from "@/app/components/Collapse";

function Question({ item }) {
  const [open, setOpen] = useState(false);
  const href = item?.link?.href;

  return (
    <div className="border-b border-primary-500/6 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 py-3 text-left"
      >
        <span className="flex-1 text-[13px] font-medium text-primary-600">{item?.question}</span>
        <ChevronDown
          size={15}
          strokeWidth={2}
          className={`shrink-0 text-primary-500/70 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <Collapse open={open}>
        <div className="pb-3.5 pr-8">
          <p className="text-[13px] leading-relaxed text-primary-500/70">{item?.answer}</p>
          {href && (
            <Link
              href={href}
              tabIndex={open ? undefined : -1}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-secondary-700 transition-colors hover:text-secondary-700"
            >
              {item?.link?.label || "Detaylı bilgi"}
              <ArrowRight size={13} strokeWidth={2} />
            </Link>
          )}
        </div>
      </Collapse>
    </div>
  );
}

export default function FrequentQuestions() {
  return (
    <MainCard
      title={
        <EditableRegion
          blockPath="faq.title"
          blockType="ShortText"
          defaultValue="Sıkça Sorulan Sorular"
        />
      }
    >
      <EditableList
        blockPath="faq.items"
        as="div"
        className="-mt-1"
        itemSchema={{
          question: { blockType: "ShortText", defaultValue: "" },
          answer: { blockType: "LongText", defaultValue: "" },
          link: { blockType: "Link", defaultValue: { href: "", label: "" } },
        }}
        defaultValue={[
          {
            question: "Zorunlu staj kaç iş günü ve ne zaman yapılır?",
            answer:
              "Toplam 40 iş günü zorunlu staj yapılır. Staj yapılan birimde en az bir mühendis bulunması gerekir. Başvuru takvimi ve belgeler staj sayfasındadır.",
            link: { href: "/egitim/staj", label: "Staj sayfası" },
          },
          {
            question: "Müfredatı ve derslerin AKTS'lerini nereden görebilirim?",
            answer:
              "Yarıyıl yarıyıl ders planı, ders kodları ve AKTS değerleri müfredat sayfasında listelenir. Her dersin kendi sayfasında içerik, kaynaklar ve paylaşılan notlar bulunur.",
            link: { href: "/egitim/mufredat", label: "Müfredat" },
          },
          {
            question: "Dilekçe ve form örneklerine nereden ulaşırım?",
            answer:
              "Bölümde kullanılan dilekçe, muafiyet ve staj formlarının tamamı formlar sayfasında toplanmıştır.",
            link: { href: "/egitim/formlar", label: "Formlar ve belgeler" },
          },
          {
            question: "Yaz okulunda başka üniversiteden ders alabilir miyim?",
            answer:
              "Alınabilecek dersler, denklik koşulları ve başvuru adımları yaz okulu sayfasında açıklanmıştır.",
            link: { href: "/egitim/yaz-okulu", label: "Yaz okulu" },
          },
          {
            question: "Erasmus başvurusu için kime danışmalıyım?",
            answer:
              "Bölüm Erasmus koordinatörleri ve ikili anlaşma listesi dış ilişkiler sayfasındadır.",
            link: { href: "/dis-iliskiler/erasmus", label: "Erasmus" },
          },
          {
            question: "Lisansüstü programlara nasıl başvurulur?",
            answer:
              "Yüksek lisans ve doktora başvuruları Fen Bilimleri Enstitüsü üzerinden yapılır. Program içerikleri ve koşullar programlar sayfasındadır.",
            link: { href: "/egitim/programlar", label: "Lisansüstü programlar" },
          },
        ]}
      >
        {(item, index) => <Question key={index} item={item} />}
      </EditableList>
    </MainCard>
  );
}
