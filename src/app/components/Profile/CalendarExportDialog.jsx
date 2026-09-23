"use client";

import { useState, useSyncExternalStore } from "react";
import { useCmsRoute } from "inscribed";
import { CalendarPlus, Check, Copy, Download, ExternalLink } from "lucide-react";

import Modal from "@/app/components/Modal";
import { useT } from "@/i18n/useT";

const neverChanges = () => () => {};
const platformOf = () => {
  const agent = navigator.userAgent;
  if (/android/i.test(agent)) return "android";
  if (/iphone|ipad|ipod|macintosh/i.test(agent)) return "apple";
  return "other";
};

const OPTION =
  "flex w-full items-center gap-3 rounded-lg border border-primary-500/10 px-3.5 py-3 text-left transition-colors hover:border-secondary-500/40 hover:bg-secondary-500/4";

function Option({ href, onClick, icon: Icon, title, hint }) {
  const body = (
    <>
      <Icon size={16} strokeWidth={1.75} className="shrink-0 text-secondary-700" />
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium text-primary-600">{title}</span>
        {hint && <span className="mt-0.5 block text-[11.5px] leading-snug text-primary-500/70">{hint}</span>}
      </span>
    </>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={OPTION}>
        {body}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={OPTION}>
      {body}
    </button>
  );
}

export default function CalendarExportDialog({ open, onClose, offeringIds, onDownload }) {
  const t = useT();
  const { locale } = useCmsRoute();
  const platform = useSyncExternalStore(neverChanges, platformOf, () => "other");
  const [copied, setCopied] = useState(false);

  const feed = `${window.location.host}/takvim.ics?o=${offeringIds.join(",")}&lang=${locale}`;
  const https = `${window.location.protocol}//${feed}`;
  const webcal = `webcal://${feed}`;
  const name = t("YTÜ Ders Programım");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(https);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const apple = {
    key: "apple",
    href: webcal,
    icon: CalendarPlus,
    title: t("Apple Takvim"),
    hint: t("iPhone, iPad ve Mac"),
  };
  const google = {
    key: "google",
    href: `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`,
    icon: ExternalLink,
    title: "Google Takvim",
    hint: t("Bilgisayarda açılır; eklenen takvim telefonunuzda da görünür."),
  };
  const outlook = {
    key: "outlook",
    href: `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(https)}&name=${encodeURIComponent(name)}`,
    icon: ExternalLink,
    title: "Outlook",
  };
  const link = {
    key: "copy",
    onClick: copy,
    icon: copied ? Check : Copy,
    title: copied ? t("Bağlantı kopyalandı") : t("Bağlantıyı kopyala"),
    hint: t("Google Takvim'de bilgisayardan Diğer takvimler → URL ile ekle'ye yapıştırın."),
  };
  const file = {
    key: "file",
    onClick: onDownload,
    icon: Download,
    title: t("Dosya olarak indir"),
    hint: t("Samsung Takvim gibi uygulamalar dosyayı doğrudan açabilir."),
  };

  const options =
    platform === "android"
      ? [link, file, outlook]
      : platform === "apple"
        ? [apple, google, outlook, file]
        : [google, apple, outlook, file];

  return (
    <Modal
      open={open}
      onClose={onClose}
      label={t("Takvime aktar")}
      contentClassName="flex items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl">
        <h2 className="text-sm font-semibold text-primary-600">{t("Takvime aktar")}</h2>
        <p className="mt-1 text-[12px] leading-relaxed text-primary-500/70">
          {t("Ders programınız takviminize eklenir ve kendiliğinden güncellenir. Yeni bir ders eklerseniz aktarmayı tekrarlayın.")}
        </p>
        {platform === "android" && (
          <p className="mt-3 rounded-lg bg-secondary-500/8 px-3 py-2 text-[11.5px] leading-relaxed text-primary-600">
            {t("Google Takvim'in Android uygulaması bağlantıdan takvim eklemeyi desteklemiyor. Bağlantıyı kopyalayıp bir kez bilgisayardan eklemeniz yeterli; takvim telefonunuza da gelir.")}
          </p>
        )}
        <div className="mt-4 flex flex-col gap-2">
          {options.map(({ key, ...option }) => (
            <Option key={key} {...option} />
          ))}
        </div>
      </div>
    </Modal>
  );
}
