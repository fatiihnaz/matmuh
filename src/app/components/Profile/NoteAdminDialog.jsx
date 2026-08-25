"use client";

import Link from "next/link";
import { ClipboardCheck, ExternalLink } from "lucide-react";

import Modal from "@/app/components/Modal";
import { NoteAdminBody } from "@/app/[locale]/yonetim/ders-notlari/components/NoteAdminPage";
import { useLocaleNav } from "@/i18n/useLocaleNav";

const PAGE = "/yonetim/ders-notlari";

export default function NoteAdminDialog({ open, onClose }) {
  const { href } = useLocaleNav();

  return (
    <Modal
      open={open}
      onClose={onClose}
      label="Not Yönetimi"
      contentClassName="flex items-center justify-center px-4 py-16 sm:px-6"
    >
      <div className="flex max-h-[68svh] w-full max-w-sm flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:max-h-144 sm:max-w-3xl lg:max-h-168 lg:max-w-5xl">
        <div className="flex shrink-0 items-center gap-2.5 border-b border-primary-500/8 px-5 py-3.5">
          <ClipboardCheck
            size={16}
            strokeWidth={1.5}
            className="text-secondary-700"
          />
          <h2 className="text-sm font-semibold text-primary-600">
            Not Yönetimi
          </h2>
          <Link
            href={href(PAGE)}
            onClick={onClose}
            className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-medium text-primary-500/70 transition-colors hover:text-secondary-700"
          >
            Sayfada aç
            <ExternalLink className="size-3" />
          </Link>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">
          <NoteAdminBody />
        </div>
      </div>
    </Modal>
  );
}
