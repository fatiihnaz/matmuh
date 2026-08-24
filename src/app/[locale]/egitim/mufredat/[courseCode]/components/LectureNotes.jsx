"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Clock3,
  Download,
  Eye,
  FileText,
  Lock,
  Paperclip,
  Shield,
  Upload,
  X,
} from "lucide-react";

import {
  deleteNote,
  fetchLectureNotes,
  fetchMyPendingNotes,
  formatSize,
  uploadLectureNote,
} from "@/data/lecture-notes";
import { useAuth } from "@/lib/auth";
import DocumentPreview, { PREVIEWABLE_KINDS } from "@/app/components/DocumentPreview";
import { SkeletonBlock, SkeletonLine } from "@/app/components/Skeleton";

const MAX_FILE_BYTES = 9 * 1024 * 1024;

const PLACEHOLDERS = [
  { id: 1, title: "Vize Soruları.pdf", meta: "PDF · 2.4 MB" },
  { id: 2, title: "Hafta 4 - Teorem İspatları.zip", meta: "ZIP · 8.1 MB" },
  { id: 3, title: "Örnek Çözümler.pdf", meta: "PDF · 1.8 MB" },
  { id: 4, title: "Final Çözümleri.pdf", meta: "PDF · 4.2 MB" },
];

function LoginPanel({ loading, onSignIn }) {
  return (
    <>
      <div className="rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-start gap-4 bg-primary-500/3 border border-primary-500/10">
        <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mt-0.5 bg-secondary-500/10">
          <Shield size={20} strokeWidth={1.5} className="text-secondary-500" />
        </div>
        <div className="flex-1">
          <h4 className="text-[15px] font-bold text-primary-700 mb-1.5">
            Giriş Yapmanız Gerekmektedir
          </h4>
          <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
            Ders notlarını görüntülemek, indirmek ve kendi notunuzu paylaşmak için{" "}
            <span className="font-mono text-[11px] font-bold text-secondary-500 bg-secondary-500/5 px-1 py-0.5 rounded">
              @std.yildiz.edu.tr
            </span>{" "}
            hesabınızla giriş yapmalısınız.
          </p>
          <button
            onClick={onSignIn}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary-500 text-primary-500 text-xs font-semibold transition-all hover:bg-secondary-500/80 disabled:opacity-50 shadow-md shadow-secondary-500/20"
          >
            <Lock size={14} strokeWidth={2} /> Öğrenci Girişi
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 backdrop-blur-sm shadow-xl">
            <Eye size={16} strokeWidth={2} className="text-secondary-500" />
            <span className="text-[13px] font-medium text-white">Önizleme</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 filter blur-[6px] opacity-40 select-none pointer-events-none">
          {PLACEHOLDERS.map((item) => (
            <div
              key={item.id}
              className="rounded-xl p-4 border border-gray-100 bg-white shadow-xs flex items-start gap-4"
            >
              <div className="w-12 h-14 rounded-lg flex flex-col items-center justify-center bg-primary-500/5">
                <FileText size={20} className="text-primary-700" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="text-sm font-semibold text-primary-700 truncate mb-1.5">
                  {item.title}
                </div>
                <span className="text-[11px] text-gray-400 font-mono">{item.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function NoteCard({ note, pending = false, onCancel, cancelling = false }) {
  const [preview, setPreview] = useState(false);
  const kind = String(note.extension ?? "").toLowerCase();
  const previewable = Boolean(note.href) && PREVIEWABLE_KINDS.has(kind);
  const rejected = note.status === "REJECTED";

  return (
    <div
      className={`group relative rounded-xl p-4 border bg-white shadow-xs flex items-start gap-4 transition-colors ${
        pending
          ? "border-amber-500/30 bg-amber-50/40"
          : "border-primary-500/10 hover:border-secondary-500/40"
      }`}
    >
      {previewable && (
        <button
          type="button"
          onClick={() => setPreview(true)}
          aria-label={`${note.title} dosyasını önizle`}
          className="absolute inset-0 z-0 cursor-pointer rounded-xl outline-offset-2"
        />
      )}

      <span className="w-12 h-14 rounded-lg flex flex-col items-center justify-center gap-1 bg-primary-500/5 shrink-0 transition-colors group-hover:bg-secondary-500/15">
        <FileText size={18} className="text-primary-700" strokeWidth={1.5} />
        <span className="text-[8px] font-bold text-primary-500/50 tracking-wide">
          {note.extension}
        </span>
      </span>
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-semibold text-primary-700 truncate">
            {note.title}
          </span>
          {pending &&
            (rejected ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-500/12 px-1.5 py-0.5 rounded shrink-0">
                <X size={9} strokeWidth={2.5} /> Reddedildi
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-500/15 px-1.5 py-0.5 rounded shrink-0">
                <Clock3 size={9} strokeWidth={2.5} /> Onay bekliyor
              </span>
            ))}
        </div>
        {note.description && (
          <p className="text-xs text-primary-500/50 leading-relaxed mb-1.5 line-clamp-2">
            {note.description}
          </p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          {note.uploadedAt && (
            <span className="text-[11px] text-gray-400 font-mono">{note.uploadedAt}</span>
          )}
          {note.size && (
            <span className="text-[11px] font-bold text-secondary-500 bg-secondary-500/10 px-1.5 py-0.5 rounded">
              {note.size}
            </span>
          )}
          {note.uploadedBy && (
            <span className="text-[11px] text-primary-500/40 truncate">
              {note.uploadedBy}
            </span>
          )}
        </div>
      </div>

      {previewable && (
        <DocumentPreview
          open={preview}
          onClose={() => setPreview(false)}
          label={note.title}
          href={note.href}
          kind={kind}
        />
      )}
      <div className="relative z-10 flex shrink-0 flex-col items-stretch gap-1.5">
        {note.href && (
          <a
            href={note.href}
            download
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary-500/5 text-primary-500 text-xs font-semibold hover:bg-secondary-500 hover:text-white transition-colors"
          >
            <Download size={13} strokeWidth={2} /> İndir
          </a>
        )}
        {pending && (
          <button
            type="button"
            onClick={() => onCancel(note)}
            disabled={cancelling}
            className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-[11px] font-medium text-primary-500/45 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
          >
            {cancelling ? "…" : rejected ? "Kaldır" : "İptal et"}
          </button>
        )}
      </div>
    </div>
  );
}

function UploadForm({ lectureId, onUploaded }) {
  const { getAccessToken } = useAuth();
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const chooseFile = useCallback((picked) => {
    if (!picked) return;
    if (picked.size > MAX_FILE_BYTES) {
      setError("Dosya 9 MB sınırını aşıyor. Daha küçük bir sürüm yükleyin.");
      return;
    }
    setError(null);
    setFile(picked);
  }, []);

  const missing =
    [!title.trim() && "Başlık", !file && "dosya"].filter(Boolean).join(" ve ") || null;

  const reset = useCallback(() => {
    setTitle("");
    setDescription("");
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  async function submit(event) {
    event.preventDefault();
    if (!file || !title.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Oturumunuz sona ermiş, sayfayı yenileyin.");
      await uploadLectureNote(lectureId, token, { title: title.trim(), description, file });
      reset();
      setOpen(false);
      setDone(true);
      onUploaded?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        {done ? (
          <span className="text-xs text-primary-500/50">
            Notunuz yüklendi, yönetici onayı bekliyor.
          </span>
        ) : (
          <span className="text-xs text-primary-500/40">
            Yüklenen notlar yönetici onayından sonra yayınlanır.
          </span>
        )}
        <button
          onClick={() => {
            setDone(false);
            setOpen(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const dropped = e.dataTransfer.files?.[0];
            if (!dropped) return;
            chooseFile(dropped);
            setDone(false);
            setOpen(true);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            dragOver
              ? "bg-secondary-500/20 text-secondary-600 ring-2 ring-secondary-500 ring-dashed"
              : "bg-secondary-500 text-primary-500 hover:bg-secondary-500/80"
          }`}
        >
          <Upload size={14} strokeWidth={2} />
          {dragOver ? "Dosyayı bırakın" : "Not Yükle"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mb-6 rounded-xl border border-primary-500/10 bg-primary-500/2 p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">
          Not Yükle
        </span>
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(false);
          }}
          className="text-primary-500/40 hover:text-primary-500 transition-colors"
          aria-label="Kapat"
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Başlık"
        maxLength={150}
        required
        className="w-full rounded-lg border border-primary-500/10 bg-white px-3 py-2 text-sm text-primary-500 outline-none focus:border-secondary-500/50"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Açıklama (isteğe bağlı)"
        rows={2}
        maxLength={500}
        className="w-full rounded-lg border border-primary-500/10 bg-white px-3 py-2 text-sm text-primary-500 outline-none focus:border-secondary-500/50 resize-none"
      />

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const dropped = e.dataTransfer.files?.[0];
          chooseFile(dropped);
        }}
        className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 text-center transition-colors ${
          dragOver
            ? "border-secondary-500 bg-secondary-500/6"
            : file
            ? "border-secondary-500/45 bg-secondary-500/3"
            : "border-primary-500/15 bg-white hover:border-secondary-500/40"
        }`}
      >
        <span
          className={`flex size-10 items-center justify-center rounded-xl transition-colors ${
            file ? "bg-secondary-500/15" : "bg-primary-500/5"
          }`}
        >
          <Paperclip size={18} strokeWidth={1.5} className="text-secondary-500" />
        </span>
        <span className="max-w-full truncate text-[13px] font-medium text-primary-600">
          {file ? file.name : dragOver ? "Bırakın" : "Dosyayı sürükleyin veya seçin"}
        </span>
        <span className="text-[11px] text-primary-500/40">
          {file ? formatSize(file.size) : "PDF, DOCX, ZIP, PNG · en fazla 9 MB"}
        </span>
        <input
          ref={inputRef}
          type="file"
          onChange={(e) => chooseFile(e.target.files?.[0] ?? null)}
          className="hidden"
        />
      </label>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy || !file || !title.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary-500 text-primary-500 text-xs font-semibold hover:bg-secondary-500/80 disabled:opacity-50 transition-colors"
        >
          <Upload size={14} strokeWidth={2} /> {busy ? "Yükleniyor…" : "Gönder"}
        </button>

        {!busy && missing && (
          <span className="text-[11px] text-primary-500/45">{missing} girin</span>
        )}
      </div>
    </form>
  );
}

export default function LectureNotes({ lectureId, onSignIn }) {
  const { isAuthenticated, isLoading: authLoading, getAccessToken } = useAuth();
  const [notes, setNotes] = useState(null);
  const [pending, setPending] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    let alive = true;
    (async () => {
      const token = await getAccessToken();
      if (!token || !alive) return;

      // Kendi bekleyen notu, onaylıların alınamaması durumunda da görünmeli.
      const [approved, mine] = await Promise.allSettled([
        fetchLectureNotes(lectureId, token),
        fetchMyPendingNotes(lectureId, token),
      ]);
      if (!alive) return;
      if (approved.status === "fulfilled") setNotes(approved.value);
      else setFailed(true);
      setPending(mine.status === "fulfilled" ? mine.value : []);
    })();
    return () => {
      alive = false;
    };
  }, [isAuthenticated, lectureId, getAccessToken, reloadKey]);

  async function cancelNote(note) {
    setCancellingId(note.id);
    try {
      const token = await getAccessToken();
      await deleteNote(note.id, token);
      setPending((current) => current.filter((item) => item.id !== note.id));
    } catch {
      setFailed(true);
    } finally {
      setCancellingId(null);
    }
  }

  if (!isAuthenticated) {
    return <LoginPanel loading={authLoading} onSignIn={onSignIn} />;
  }

  return (
    <div className="w-full">
      <UploadForm lectureId={lectureId} onUploaded={() => setReloadKey((k) => k + 1)} />

      {pending.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-amber-500 rounded-full" />
            <h3 className="text-xs font-bold text-primary-500 uppercase tracking-widest">
              Yüklediğiniz, henüz yayımlanmamış notlar
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pending.map((note) => (
              <NoteCard key={note.id} note={note} pending onCancel={cancelNote} cancelling={cancellingId === note.id} />
            ))}
          </div>
          <p className="text-[11px] text-primary-500/40 mt-2.5">
            Bu notlar yalnızca size görünür. Onaylananlar aşağıdaki listeye geçer.
          </p>
        </div>
      )}

      {failed ? (
        <p className="text-sm text-primary-500/40 py-12 text-center border border-dashed border-primary-500/20 rounded-xl">
          Ders notları alınamadı. Oturumunuz sona ermiş olabilir, sayfayı yenileyin.
        </p>
      ) : notes === null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-xl border border-primary-500/10 bg-white p-4 shadow-xs"
            >
              <SkeletonBlock className="h-14 w-12 shrink-0" />
              <div className="flex-1 space-y-2">
                <SkeletonLine className="w-3/4" />
                <SkeletonLine className="w-full" />
                <SkeletonLine className="w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 px-4 border border-dashed border-primary-500/20 rounded-xl text-center">
          <FileText size={20} strokeWidth={1.5} className="text-primary-500/25" />
          <span className="text-sm font-medium text-primary-500/40">
            Bu ders için henüz onaylanmış not yok.
          </span>
          {pending.length === 0 && (
            <span className="text-xs text-primary-500/30">
              İlk notu siz yükleyebilirsiniz.
            </span>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
