"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Download,
  FileText,
  Lock,
  RotateCcw,
  Search,
  ShieldAlert,
  Trash2,
} from "lucide-react";

import PageLayout from "@/app/components/PageLayout";
import SubHeader from "@/app/components/Header/SubHeader";
import { deleteNote, fetchAllNotes, setNoteStatus } from "@/data/lecture-notes";
import { useAuth } from "@/lib/auth";

const FILTERS = [
  { id: "pending", label: "Onay Bekleyen", status: "PENDING" },
  { id: "approved", label: "Onaylı", status: "APPROVED" },
  { id: "rejected", label: "Reddedilen", status: "REJECTED" },
  { id: "all", label: "Tümü", status: undefined },
];

const BADGES = {
  APPROVED: {
    label: "Onaylı",
    style: { color: "var(--color-secondary-600)", backgroundColor: "rgba(173,151,111,0.14)" },
  },
  PENDING: {
    label: "Bekliyor",
    style: { color: "#b45309", backgroundColor: "rgba(180,83,9,0.1)" },
  },
  REJECTED: {
    label: "Reddedildi",
    style: { color: "#b91c1c", backgroundColor: "rgba(185,28,28,0.1)" },
  },
};

const PAGE_SIZE = 20;

function Notice({ icon: Icon, title, children }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 px-6 border border-dashed border-primary-500/20 rounded-xl text-center bg-white">
      <Icon size={22} strokeWidth={1.5} className="text-primary-500/25" />
      <span className="text-sm font-semibold text-primary-500/60">{title}</span>
      {children}
    </div>
  );
}

function NoteRow({ note, busy, onApprove, onDelete }) {
  return (
    <div className="px-4 sm:px-5 py-4 flex flex-col lg:flex-row lg:items-center gap-4">
      <div className="w-11 h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 bg-primary-500/5 shrink-0">
        <FileText size={16} className="text-primary-700" strokeWidth={1.5} />
        <span className="text-[8px] font-bold text-primary-500/50">{note.extension}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-semibold text-primary-700 truncate">
            {note.title}
          </span>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
            style={BADGES[note.status].style}
          >
            {BADGES[note.status].label}
          </span>
        </div>

        {note.description && (
          <p className="text-xs text-primary-500/50 leading-relaxed mb-1.5 line-clamp-2">
            {note.description}
          </p>
        )}

        <div className="flex items-center gap-3 flex-wrap text-[11px] text-primary-500/40">
          {note.lectureCode && (
            <Link
              href={`/egitim/mufredat/${note.lectureCode}`}
              className="font-mono font-semibold text-secondary-500 hover:underline"
            >
              {note.lectureCode}
            </Link>
          )}
          {note.lectureName && <span className="truncate">{note.lectureName}</span>}
          {note.uploadedBy && <span>· {note.uploadedBy}</span>}
          {note.uploadedAt && <span className="font-mono">· {note.uploadedAt}</span>}
          {note.size && <span className="font-mono">· {note.size}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {note.href && (
          <a
            href={note.href}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-500/5 text-primary-500 text-xs font-semibold hover:bg-primary-500/10 transition-colors"
          >
            <Download size={13} strokeWidth={2} /> İndir
          </a>
        )}
        <button
          onClick={() => onApprove(note)}
          disabled={busy}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 ${
            note.approved
              ? "bg-primary-500/5 text-primary-500 hover:bg-primary-500/10"
              : "bg-secondary-500 text-primary-500 hover:bg-secondary-500/80"
          }`}
        >
          {note.approved ? (
            <>
              <RotateCcw size={13} strokeWidth={2} /> Onayı Kaldır
            </>
          ) : (
            <>
              <Check size={13} strokeWidth={2} /> Onayla
            </>
          )}
        </button>
        <button
          onClick={() => onDelete(note)}
          disabled={busy}
          aria-label="Notu sil"
          className="inline-flex items-center justify-center size-9 rounded-lg text-red-700/60 hover:bg-red-50 transition-colors disabled:opacity-40"
        >
          <Trash2 size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export default function NoteAdminPage() {
  const { user, isAuthenticated, isLoading: authLoading, signIn, getAccessToken } = useAuth();
  const isAdmin = Boolean(user?.authorities?.includes("ROLE_ADMIN"));

  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) throw new Error("Oturumunuz sona ermiş, sayfayı yenileyin.");
    const status = FILTERS.find((f) => f.id === filter)?.status;
    return fetchAllNotes(token, { status, search: query, page, size: PAGE_SIZE });
  }, [getAccessToken, filter, query, page]);

  useEffect(() => {
    if (!isAdmin) return undefined;
    let alive = true;
    setError(null);
    load()
      .then((data) => alive && setResult(data))
      .catch((err) => alive && setError(err.message));
    return () => {
      alive = false;
    };
  }, [isAdmin, load]);

  async function act(note, fn) {
    setBusyId(note.id);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Oturumunuz sona ermiş, sayfayı yenileyin.");
      await fn(token);
      setResult(await load());
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const onApprove = (note) =>
    act(note, (token) => setNoteStatus(note.id, note.approved ? "PENDING" : "APPROVED", token));

  const onDelete = (note) => {
    if (!window.confirm(`"${note.title}" listeden kaldırılacak. Emin misiniz?`)) return;
    act(note, (token) => deleteNote(note.id, token));
  };

  let body;
  if (authLoading) {
    body = <Notice icon={Lock} title="Oturum kontrol ediliyor…" />;
  } else if (!isAuthenticated) {
    body = (
      <Notice icon={Lock} title="Giriş yapmanız gerekiyor">
        <button
          onClick={() => signIn()}
          className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary-500 text-primary-500 text-xs font-semibold hover:bg-secondary-500/80 transition-colors"
        >
          <Lock size={14} strokeWidth={2} /> Giriş Yap
        </button>
      </Notice>
    );
  } else if (!isAdmin) {
    body = (
      <Notice icon={ShieldAlert} title="Bu sayfaya erişim yetkiniz yok">
        <span className="text-xs text-primary-500/40">
          Ders notu yönetimi yalnızca yöneticilere açıktır.
        </span>
      </Notice>
    );
  } else {
    body = (
      <div className="space-y-4">
        <div className="rounded-xl border border-primary-500/10 shadow-xs bg-white overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-4 py-3 flex-wrap">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar -mx-1 px-1">
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setFilter(item.id);
                    setPage(0);
                  }}
                  className="px-4 py-2 rounded-lg transition-colors shrink-0 whitespace-nowrap"
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: filter === item.id ? 600 : 450,
                    color: filter === item.id ? "#fff" : "rgba(29,36,69,0.5)",
                    backgroundColor:
                      filter === item.id ? "var(--color-primary-500)" : "transparent",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setQuery(search.trim());
                setPage(0);
              }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500/30"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Başlık veya açıklamada ara"
                  className="w-56 rounded-lg border border-primary-500/10 bg-white pl-8 pr-3 py-2 text-xs text-primary-500 outline-none focus:border-secondary-500/50"
                />
              </div>
            </form>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 px-1">{error}</p>
        )}

        <div className="rounded-xl border border-primary-500/10 shadow-xs bg-white overflow-hidden divide-y divide-primary-500/6">
          {result === null ? (
            <p className="text-sm text-primary-500/40 py-16 text-center">Yükleniyor…</p>
          ) : result.items.length === 0 ? (
            <p className="text-sm text-primary-500/40 py-16 text-center">
              {query
                ? "Aramanızla eşleşen not yok."
                : filter === "pending"
                  ? "Onay bekleyen not yok."
                  : "Kayıtlı not yok."}
            </p>
          ) : (
            result.items.map((note) => (
              <NoteRow
                key={note.id}
                note={note}
                busy={busyId === note.id}
                onApprove={onApprove}
                onDelete={onDelete}
              />
            ))
          )}
        </div>

        {result && result.totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 px-1">
            <span className="text-xs text-primary-500/40">
              {result.totalElements} not · sayfa {result.page + 1}/{result.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={result.page === 0}
                className="px-3 py-1.5 rounded-lg bg-primary-500/5 text-xs font-semibold text-primary-500 disabled:opacity-40"
              >
                Önceki
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={result.page + 1 >= result.totalPages}
                className="px-3 py-1.5 rounded-lg bg-primary-500/5 text-xs font-semibold text-primary-500 disabled:opacity-40"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <SubHeader
        title="Not Yönetimi"
        subTitle="Yüklenen ders notlarını inceleyin, onaylayın veya kaldırın"
      />
      <PageLayout>{body}</PageLayout>
    </>
  );
}
