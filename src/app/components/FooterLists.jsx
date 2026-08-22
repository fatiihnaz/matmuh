"use client";

import { Phone } from "lucide-react";
import { EditableList } from "inscribed";

import { safeHref, isExternalHref } from "@/lib/href";

export function FooterPhones() {
  return (
    <EditableList
      blockPath="footer.contact.phones"
      scope="global"
      as="div"
      className="space-y-3"
      itemSchema={{
        number: { blockType: "ShortText", defaultValue: "" },
        note: { blockType: "ShortText", defaultValue: "" },
      }}
      defaultValue={[
        { number: "+90 (212) 383 45 90", note: "Bölüm Başkanlığı" },
        { number: "+90 (212) 383 45 92", note: "Bölüm Öğrenci İşleri" },
        { number: "+90 (212) 383 45 91", note: "Bölüm Sekreterliği" },
      ]}
    >
      {(item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Phone size={14} className="shrink-0" />
          <span>
            {item.number}
            {item.note ? ` (${item.note})` : ""}
          </span>
        </div>
      )}
    </EditableList>
  );
}

export function FooterLinks() {
  return (
    <EditableList
      blockPath="footer.links.items"
      scope="global"
      as="div"
      className="space-y-3"
      itemSchema={{
        link: { blockType: "Link", defaultValue: { href: "", label: "" } },
      }}
      defaultValue={[
        { link: { href: "https://www.yildiz.edu.tr", label: "YTÜ Ana Sayfa" } },
        { link: { href: "https://kmf.yildiz.edu.tr", label: "Kimya-Metalurji Fakültesi" } },
        { link: { href: "https://ois.yildiz.edu.tr", label: "Öğrenci İşleri" } },
        { link: { href: "https://kutuphane.yildiz.edu.tr", label: "Kütüphane" } },
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
            className="block hover:text-white transition-colors"
          >
            {item.link?.label}
          </a>
        );
      }}
    </EditableList>
  );
}
