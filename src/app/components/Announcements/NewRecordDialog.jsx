"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Plus } from "lucide-react";
import { CollectionComposer } from "inscribed/collections";

import Modal from "@/app/components/Modal";
import { useIsEditor } from "@/app/lib/cms-provider.jsx";
import { useLocaleNav } from "@/i18n/useLocaleNav";

export default function NewRecordDialog({ collection, page, label, title, submitLabel }) {
  const isEditor = useIsEditor();
  const router = useRouter();
  const { href } = useLocaleNav();
  const [open, setOpen] = useState(false);

  if (!isEditor) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-secondary-500/10 px-3 py-1.5 text-[12px] font-medium text-secondary-600 transition-colors hover:bg-secondary-500/15"
      >
        <Plus className="size-3.5" />
        {label}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        label={title}
        dismissible={false}
        contentClassName="flex items-start justify-center px-3 py-14 sm:px-6"
      >
        <div className="flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
          <div className="flex shrink-0 items-center gap-3 border-b border-primary-500/8 px-5 py-3.5">
            <h2 className="flex-1 text-sm font-semibold text-primary-600">{title}</h2>
            <Link
              href={href(page)}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary-500/45 transition-colors hover:text-secondary-600"
            >
              Sayfada aç
              <ExternalLink className="size-3" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-[11px] font-medium text-primary-500/45 transition-colors hover:bg-primary-500/5 hover:text-primary-500"
            >
              Vazgeç
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
            <CollectionComposer
              collection={collection}
              submitLabel={submitLabel}
              onCreated={(item) => {
                setOpen(false);
                router.push(href(`${page.replace(/\/yeni$/, "")}/${item.slug}`));
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
