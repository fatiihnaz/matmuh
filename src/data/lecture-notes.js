const API = process.env.NEXT_PUBLIC_API_URL || "/api";

const UNITS = ["B", "KB", "MB", "GB"];

export function formatSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return null;
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 10 || unit === 0 ? Math.round(value) : value.toFixed(1)} ${UNITS[unit]}`;
}

export function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
}

const extensionOf = (fileName) => {
  const match = /\.([A-Za-z0-9]{1,6})$/.exec(String(fileName ?? ""));
  return match ? match[1].toUpperCase() : "DOSYA";
};

// Mutlak adres üretiliyor; yolu koruyup kendi kaynağımıza çevirince HttpOnly
// access_token çerezi isteğe katılıyor ve indirme dev'de de çalışıyor.
export function sameOrigin(fileUrl) {
  if (!fileUrl) return null;
  try {
    const { pathname, search } = new URL(fileUrl);
    return pathname.startsWith("/api/") ? `${pathname}${search}` : fileUrl;
  } catch {
    return fileUrl;
  }
}

const fullName = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(" ") || null;

const statusOf = (note) => note.status ?? "PENDING";

const SEMESTERS = { FALL: "Güz", SPRING: "Bahar", SUMMER: "Yaz" };

export function toOffering(offering) {
  if (!offering) return null;
  const term = [offering.academicYear, SEMESTERS[offering.semester] ?? offering.semester]
    .filter(Boolean)
    .join(" ");
  return {
    term: term || null,
    group: offering.groupNumber ? `Grup ${offering.groupNumber}` : null,
    instructor: offering.instructorName || null,
  };
}

function toNote(note) {
  const file = note.file ?? {};
  return {
    id: note.id,
    status: statusOf(note),
    approved: statusOf(note) === "APPROVED",
    lectureCode: note.lecture?.code ?? null,
    lectureName: note.lecture?.name ?? null,
    lectureSlug: note.lecture?.slug ?? null,
    title: note.title || file.fileName || "Adsız not",
    description: note.description || null,
    href: sameOrigin(file.fileUrl),
    previewHref: sameOrigin(note.previewUrl) ?? null,
    fileName: file.fileName ?? null,
    extension: extensionOf(file.fileName),
    size: formatSize(file.fileSize),
    uploadedAt: formatDate(note.createdAt),
    uploadedBy: fullName(note.createdBy),
    viewCount: note.viewCount ?? 0,
    offering: toOffering(note.offering),
    type: note.type ?? "OTHER",
  };
}

export async function fetchLectureNotes(lectureId, token) {
  const res = await fetch(`${API}/lectures/${lectureId}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`notes ${res.status}`);
  const body = await res.json();
  const rows = body?.data ?? body ?? [];
  return (Array.isArray(rows) ? rows : []).map(toNote);
}

export async function uploadLectureNote(lectureId, token, { title, description, file, type }) {
  const form = new FormData();
  form.append(
    "data",
    new Blob([JSON.stringify({ title, description: description || null, type })], {
      type: "application/json",
    }),
  );
  form.append("file", file);

  const res = await fetch(`${API}/lectures/${lectureId}/notes`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Yükleme başarısız (${res.status})`);
  }
  return res.json();
}

export async function fetchMyPendingNotes(lectureId, token) {
  const params = new URLSearchParams({
    lectureId,
    size: "50",
    sort: "createdAt,desc",
  });
  const res = await fetch(`${API}/lecture-notes/me?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`my-notes ${res.status}`);
  const body = await res.json();
  return (body?.data?.content ?? [])
    .map(toNote)
    .filter((note) => note.status !== "APPROVED");
}

export async function fetchAllNotes(token, { status, search, page = 0, size = 20 } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size), sort: "createdAt,desc" });
  if (status) params.set("status", status);
  if (search) params.set("search", search);

  const res = await fetch(`${API}/lecture-notes?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`lecture-notes ${res.status}`);
  const body = await res.json();
  const data = body?.data ?? body ?? {};
  return {
    items: (data.content ?? []).map(toNote),
    page: data.page ?? 0,
    totalPages: data.totalPages ?? 0,
    totalElements: data.totalElements ?? 0,
  };
}

export async function setNoteStatus(id, status, token) {
  const res = await fetch(`${API}/lecture-notes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `İşlem başarısız (${res.status})`);
  }
}

export async function deleteNote(id, token) {
  const res = await fetch(`${API}/lecture-notes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Silinemedi (${res.status})`);
  }
}

export const NOTE_TYPES = [
  { id: "LECTURE_NOTE", label: "Ders Notu" },
  { id: "SUMMARY", label: "Özet" },
  { id: "PAST_EXAM", label: "Çıkmış Soru" },
  { id: "SAMPLE_QUESTION", label: "Örnek Soru" },
  { id: "SOLUTION", label: "Çözüm" },
  { id: "HOMEWORK", label: "Ödev" },
  { id: "PROJECT", label: "Proje" },
  { id: "LAB_REPORT", label: "Lab Raporu" },
  { id: "PRESENTATION", label: "Sunum" },
  { id: "CHEAT_SHEET", label: "Kopya Kâğıdı" },
  { id: "FORMULA_SHEET", label: "Formül Sayfası" },
  { id: "BOOK", label: "Kitap" },
  { id: "ARTICLE", label: "Makale" },
  { id: "VIDEO_LINK", label: "Video Bağlantısı" },
  { id: "SYLLABUS", label: "İzlence" },
  { id: "OTHER", label: "Diğer" },
];

export const noteTypeLabel = (id) =>
  NOTE_TYPES.find((type) => type.id === id)?.label ?? null;
