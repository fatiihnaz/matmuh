"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Plus } from "lucide-react";
import { CollectionFieldsForm, useCollectionCreate, useMyCollections } from "inscribed/collections";

import Modal from "@/app/components/Modal";
import RecordPreview from "./RecordPreview";
import { useIsEditor } from "@/app/lib/cms-provider.jsx";
import { useLocaleNav } from "@/i18n/useLocaleNav";

const PANES = [
  { id: "form", label: "Form" },
  { id: "preview", label: "Önizleme" },
];

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
        className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-secondary-500/10 px-3 py-1.5 text-[12px] font-medium text-secondary-700 transition-colors hover:bg-secondary-500/15"
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
        <div className="flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
          <div className="flex shrink-0 items-center gap-3 border-b border-primary-500/8 px-5 py-3.5">
            <h2 className="flex-1 text-sm font-semibold text-primary-600">{title}</h2>
            <Link
              href={href(page)}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary-500/70 transition-colors hover:text-secondary-700"
            >
              Sayfada aç
              <ExternalLink className="size-3" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-[11px] font-medium text-primary-500/70 transition-colors hover:bg-primary-500/5 hover:text-primary-500"
            >
              Vazgeç
            </button>
          </div>

          <Composer
            collection={collection}
            submitLabel={submitLabel}
            onCreated={(item) => {
              setOpen(false);
              router.push(href(`${page.replace(/\/yeni$/, "")}/${item.slug}`));
            }}
          />
        </div>
      </Modal>
    </>
  );
}

function Composer({ collection, submitLabel, onCreated }) {
  const { collections, isLoading } = useMyCollections();
  const meta = collections.find((entry) => entry.collectionKey === collection);

  if (isLoading) {
    return <p className="p-5 text-[12px] text-primary-500/70">Yükleniyor…</p>;
  }

  if (!meta?.schema || !meta.canCreate) {
    return (
      <p className="p-5 text-[13px] text-primary-500/70">
        Bu koleksiyonda kayıt oluşturma yetkiniz yok.
      </p>
    );
  }

  return (
    <ComposerPanes
      key={collection}
      collectionKey={collection}
      schema={meta.schema}
      submitLabel={submitLabel}
      onCreated={onCreated}
    />
  );
}

function ComposerPanes({ collectionKey, schema, submitLabel, onCreated }) {
  const [pane, setPane] = useState("form");
  const { values, setValues, submit, reset, deleteDraft, hasServerDraft, isPending, error } =
    useCollectionCreate({ collectionKey, schema });

  useEffect(() => {
    if (schema?.fields?.some((f) => f.name === "publishedAt") && values && !values.publishedAt && !hasServerDraft) {
      const now = new Date();
      now.setSeconds(0, 0);
      setValues({ ...values, publishedAt: now.toISOString() });
    }
  }, [schema, values, setValues, hasServerDraft]);

  return (
    <>
      <div className="flex shrink-0 gap-1 border-b border-primary-500/8 px-5 py-2 lg:hidden">
        {PANES.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setPane(entry.id)}
            className={`rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
              pane === entry.id
                ? "bg-secondary-500/10 text-secondary-700"
                : "text-primary-500/70 hover:bg-primary-500/5"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-1 lg:grid-cols-2">
        <div
          className={`min-h-0 overflow-y-auto overscroll-contain p-5 lg:block ${
            pane === "form" ? "block" : "hidden"
          }`}
        >
          <CollectionFieldsForm
            fields={schema.fields}
            values={values}
            onChange={setValues}
            disabled={isPending}
          />
        </div>

        <div
          className={`min-h-0 overflow-y-auto overscroll-contain bg-primary-500/3 p-5 lg:block lg:border-l lg:border-primary-500/8 ${
            pane === "preview" ? "block" : "hidden"
          }`}
        >
          <RecordPreview values={values} collection={collectionKey} />
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-primary-500/8 px-5 py-3">
        {error && (
          <p role="alert" className="flex-1 text-[12px] leading-snug text-red-700">
            {error}
          </p>
        )}
        <div className="ml-auto flex items-center gap-2">
          {hasServerDraft && (
            <button
              type="button"
              onClick={() => {
                reset();
                deleteDraft();
              }}
              disabled={isPending}
              className="rounded-md px-3 py-1.5 text-[12px] font-medium text-primary-500/70 transition-colors hover:bg-primary-500/5 hover:text-primary-500 disabled:opacity-40"
            >
              Taslağı temizle
            </button>
          )}
          <button
            type="button"
            onClick={() => submit(onCreated)}
            disabled={isPending}
            className="rounded-md bg-secondary-500/10 px-4 py-1.5 text-[12px] font-medium text-secondary-700 transition-colors hover:bg-secondary-500/15 disabled:opacity-40"
          >
            {isPending ? "Kaydediliyor…" : submitLabel}
          </button>
        </div>
      </div>
    </>
  );
}
