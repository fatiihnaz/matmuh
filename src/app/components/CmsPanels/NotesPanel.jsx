"use client";

/**
 * @file The drawer's note review area, registered through
 * `createCmsPage({ panels })`. Its own module because `Component` and `icon`
 * have to be exports of a "use client" module to cross into the server-side
 * panel descriptor.
 *
 * Shaped after the Collections area: a tab strip switches the window, the rows
 * below list what is in it, and opening one slides a pane over the whole thing.
 * `PanelStack` draws that drill-down and reports the header path, so the stack
 * and the breadcrumb stay the same fact.
 *
 * Styling comes from `panel-ui.js`, which restates the drawer's tokens because
 * inscribed exports none of them.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { PanelStack, useCmsPanel } from "inscribed/panels";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Download,
  Eye,
  FileText,
  RotateCcw,
  Search,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";

import { canPreview } from "@/app/components/DocumentPreview";
import { noteTypeLabel } from "@/data/lecture-notes";
import { NOTE_FILTERS, useNoteReview } from "@/data/useNoteReview";
import { NOTES_PANEL_ACCENT } from "./notes-panel-meta";
import NotePreviewPane from "./NotePreviewPane";
import PanelTabBar from "./PanelTabBar";
import {
  CHEVRON_CLASS,
  F,
  R,
  SUBROW_CLASS,
  T,
  chevronStyle,
  listStyle,
  rowCodeStyle,
  rowCountStyle,
  rowIconStyle,
  rowIdentityStyle,
  rowMetaStyle,
  rowPropertyStyle,
  rowStyle,
  rowTextColStyle,
  rowTitleStyle,
  tightListStyle,
} from "./panel-ui";

const PAGE_SIZE = 15;

const STATUS = {
  APPROVED: { label: "Onaylı", color: T.ok },
  PENDING: { label: "Bekliyor", color: T.warn },
  REJECTED: { label: "Reddedildi", color: T.danger },
};

export function NotesPanelIcon() {
  return <ClipboardCheck size={17} strokeWidth={1.6} />;
}

function StatusDot({ status }) {
  const { color } = STATUS[status] ?? STATUS.PENDING;
  return (
    <span
      aria-hidden="true"
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 5px color-mix(in srgb, ${color} 50%, transparent)`,
        flexShrink: 0,
      }}
    />
  );
}

function Notice({ icon: Icon, title, children }) {
  return (
    <div
      style={{
        margin: 16,
        padding: "48px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        textAlign: "center",
        border: `1px dashed ${T.border}`,
        borderRadius: R.md + 4,
      }}
    >
      <Icon size={20} strokeWidth={1.5} style={{ color: T.faint }} />
      <span style={{ font: `600 12px/1.3 ${F.sans}`, color: T.mid }}>{title}</span>
      {children}
    </div>
  );
}

function Message({ children, tone }) {
  return (
    <p
      style={{
        margin: 0,
        padding: "48px 16px",
        textAlign: "center",
        font: `12px/1.45 ${F.sans}`,
        color: tone === "danger" ? T.danger : T.muted,
      }}
    >
      {children}
    </p>
  );
}

/** One note, at the weight the Collections area gives a record row. */
function NoteRow({ note, onOpen }) {
  const typeLabel = note.type !== "OTHER" ? noteTypeLabel(note.type) : null;
  const meta = [typeLabel, note.uploadedBy, note.uploadedAt].filter(Boolean).join(" · ");

  return (
    <button type="button" onClick={onOpen} className={SUBROW_CLASS} style={rowStyle}>
      <span style={{ ...rowIconStyle, color: T.muted }} aria-hidden="true">
        <FileText size={13} strokeWidth={1.6} />
      </span>

      <span style={rowTextColStyle}>
        <span style={rowIdentityStyle}>
          <StatusDot status={note.status} />
          <span style={rowTitleStyle} title={note.title}>
            {note.title}
          </span>
        </span>
        <span style={rowPropertyStyle}>
          {note.lectureCode && <span style={rowCodeStyle}>{note.lectureCode}</span>}
          <span style={rowMetaStyle}>{meta}</span>
        </span>
      </span>

      <span className={CHEVRON_CLASS} style={chevronStyle} aria-hidden="true">
        <ChevronRight size={13} />
      </span>
    </button>
  );
}

function Field({ label, children }) {
  if (!children) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={{ font: `500 10px/1 ${F.sans}`, color: T.faint }}>{label}</span>
      <span style={{ font: `12px/1.45 ${F.sans}`, color: T.text }}>{children}</span>
    </div>
  );
}

function Action({ icon: Icon, children, onClick, href, download, disabled, tone }) {
  const glyph = Icon ? <Icon size={12} strokeWidth={2} /> : null;
  const style = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "7px 12px",
    borderRadius: R.btn,
    border: 0,
    cursor: "pointer",
    font: `600 11px/1 ${F.sans}`,
    ...(tone === "primary"
      ? { background: NOTES_PANEL_ACCENT, color: T.bg }
      : tone === "danger"
        ? { background: T.surface2, color: T.danger }
        : { background: T.surface2, color: T.text }),
    ...(disabled ? { opacity: 0.4, pointerEvents: "none" } : null),
  };

  if (href) {
    return (
      <a href={href} download={download} style={{ ...style, textDecoration: "none" }}>
        {glyph}
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} style={style}>
      {glyph}
      {children}
    </button>
  );
}

function NoteDetail({ note, busy, confirming, onSetStatus, onDelete, onConfirm, onPreview }) {
  const status = STATUS[note.status] ?? STATUS.PENDING;
  const kind = String(note.extension ?? "").toLowerCase();
  const previewable = canPreview(note.href, kind, note.previewHref);

  return (
    <div style={{ ...listStyle, gap: 16, padding: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ font: `600 14px/1.35 ${F.sans}`, color: T.textHi }}>{note.title}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 8px",
              borderRadius: R.pill,
              font: `600 10px/1 ${F.sans}`,
              color: status.color,
              background: `color-mix(in srgb, ${status.color} 14%, transparent)`,
            }}
          >
            <StatusDot status={note.status} />
            {status.label}
          </span>
          {note.extension && <span style={rowCodeStyle}>{note.extension}</span>}
          {note.size && <span style={rowCountStyle}>{note.size}</span>}
        </span>
      </div>

      <div style={{ display: "grid", gap: 12, padding: 12, borderRadius: R.md, background: T.surface1 }}>
        <Field label="Ders">
          {note.lectureCode
            ? `${note.lectureCode}${note.lectureName ? ` · ${note.lectureName}` : ""}`
            : null}
        </Field>
        <Field label="Tür">{noteTypeLabel(note.type)}</Field>
        <Field label="Yükleyen">{note.uploadedBy}</Field>
        <Field label="Tarih">{note.uploadedAt}</Field>
        <Field label="Açıklama">{note.description}</Field>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {previewable && (
          <Action icon={Eye} onClick={() => onPreview(note)}>
            Önizle
          </Action>
        )}
        {note.href && (
          <Action icon={Download} href={note.href} download={note.title}>
            İndir
          </Action>
        )}
      </div>

      <div style={{ height: 1, background: T.hairline }} />

      {confirming ? (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <span style={{ flex: 1, font: `12px/1.3 ${F.sans}`, color: T.mid }}>
            Bu not kalıcı olarak kaldırılsın mı?
          </span>
          <Action icon={Trash2} tone="danger" onClick={() => onDelete(note)} disabled={busy}>
            Kaldır
          </Action>
          <Action icon={X} onClick={() => onConfirm(null)}>
            Vazgeç
          </Action>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {note.status === "APPROVED" ? (
            <Action icon={RotateCcw} onClick={() => onSetStatus(note, "PENDING")} disabled={busy}>
              Onayı Kaldır
            </Action>
          ) : (
            <Action icon={Check} tone="primary" onClick={() => onSetStatus(note, "APPROVED")} disabled={busy}>
              Onayla
            </Action>
          )}
          {note.status === "PENDING" && (
            <Action icon={X} tone="danger" onClick={() => onSetStatus(note, "REJECTED")} disabled={busy}>
              Reddet
            </Action>
          )}
          <Action icon={Trash2} tone="danger" onClick={() => onConfirm(note.id)} disabled={busy}>
            Kaldır
          </Action>
        </div>
      )}
    </div>
  );
}

export function NotesPanel() {
  const { request, setBadge, isActive } = useCmsPanel();
  const {
    authLoading,
    isAdmin,
    filter,
    selectFilter,
    search,
    setSearch,
    submitSearch,
    query,
    setPage,
    result,
    counts,
    pendingCount,
    error,
    busyId,
    confirmId,
    setConfirmId,
    reload,
    onSetStatus,
    onDelete,
  } = useNoteReview({ request, pageSize: PAGE_SIZE });

  const [openNoteId, setOpenNoteId] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setBadge(pendingCount || null);
  }, [pendingCount, setBadge]);

  // The panel is mounted once and then kept, so coming back to it is the only
  // moment it can notice notes uploaded meanwhile. Nothing polls: an editor
  // reading another area should not keep this fetching.
  const wasActive = useRef(isActive);
  useEffect(() => {
    if (isActive && !wasActive.current) reload();
    wasActive.current = isActive;
  }, [isActive, reload]);

  const openNote = result?.items.find((item) => item.id === openNoteId) ?? null;

  // Moderating from the detail view returns to the list, which is both the
  // triage flow (decide, next one) and the answer to the note leaving the tab
  // it was opened from: no pane is left stranded behind a crumb.
  const handleSetStatus = useCallback(
    async (note, status) => {
      await onSetStatus(note, status);
      setOpenNoteId(null);
    },
    [onSetStatus],
  );

  const handleDelete = useCallback(
    async (note) => {
      await onDelete(note);
      setOpenNoteId(null);
    },
    [onDelete],
  );

  const onBack = useCallback(() => setOpenNoteId(null), []);
  const closePreview = useCallback(() => setPreview(null), []);

  if (authLoading) return <Notice icon={Clock} title="Oturum kontrol ediliyor…" />;

  if (!isAdmin) {
    return (
      <Notice icon={ShieldAlert} title="Bu alana erişim yetkiniz yok">
        <span style={{ font: `11px/1.4 ${F.sans}`, color: T.faint }}>
          Ders notu yönetimi yalnızca yöneticilere açıktır.
        </span>
      </Notice>
    );
  }

  const noteList = (
    <div>
      {/* Sticky rather than a sibling above the scroller: a PanelStack layer is
          itself the scroll container, so a strip outside it is not an option. */}
      <div style={{ position: "sticky", top: 0, zIndex: 1, background: T.bg }}>
        <PanelTabBar
          tabs={NOTE_FILTERS.map((item) => ({
            id: item.id,
            label: item.label,
            count: counts?.[item.id] ?? null,
          }))}
          activeTab={filter}
          onChange={selectFilter}
          accent={NOTES_PANEL_ACCENT}
        />

        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch();
          }}
          style={{ position: "relative", padding: "10px 16px 2px" }}
        >
          <Search size={12} style={{ position: "absolute", left: 26, top: 20, color: T.muted }} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Başlık veya açıklamada ara"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "7px 10px 7px 26px",
              borderRadius: R.sm,
              border: `1px solid ${T.border}`,
              background: T.surface1,
              color: T.text,
              font: `11px/1 ${F.sans}`,
              outline: "none",
            }}
          />
        </form>
      </div>

      {error && <Message tone="danger">{error}</Message>}

      {result === null ? (
        <Message>Yükleniyor…</Message>
      ) : result.items.length === 0 ? (
        <Message>{query ? "Aramanızla eşleşen not yok." : "Bu sekmede not yok."}</Message>
      ) : (
        <div style={tightListStyle}>
          {result.items.map((note) => (
            <NoteRow key={note.id} note={note} onOpen={() => setOpenNoteId(note.id)} />
          ))}
        </div>
      )}

      {result && result.totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            padding: "10px 16px 16px",
          }}
        >
          <span style={rowCountStyle}>
            {result.totalElements} not · {result.page + 1}/{result.totalPages}
          </span>
          <span style={{ display: "flex", gap: 6 }}>
            <Action
              icon={ChevronLeft}
              onClick={() => setPage((value) => Math.max(0, value - 1))}
              disabled={result.page === 0}
            >
              Önceki
            </Action>
            <Action
              onClick={() => setPage((value) => value + 1)}
              disabled={result.page + 1 >= result.totalPages}
            >
              Sonraki
              <ChevronRight size={12} strokeWidth={2} />
            </Action>
          </span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <PanelStack
        onBack={onBack}
        views={[
          { key: "notes", label: "Not Yönetimi", node: noteList },
          openNote && {
            key: `note-${openNote.id}`,
            label: openNote.title,
            node: (
              <NoteDetail
                note={openNote}
                busy={busyId === openNote.id}
                confirming={confirmId === openNote.id}
                onSetStatus={handleSetStatus}
                onDelete={handleDelete}
                onConfirm={setConfirmId}
                onPreview={setPreview}
              />
            ),
          },
        ]}
      />

      <NotePreviewPane note={preview} onClose={closePreview} />
    </>
  );
}
