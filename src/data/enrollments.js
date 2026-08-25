const API = process.env.NEXT_PUBLIC_API_URL || "/api";

// Kayit uclari kullaniciya ozel, hepsi tarayicidan cagriliyor. Sunucu tarafinda
// cagirmayin: token istekle birlikte gelmiyor ve sayfa herkes icin ayni onbellege
// duserdi.
async function request(path, { method = "GET", token, body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    credentials: "include",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const error = new Error(`${path} -> ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return res.status === 204 ? null : res.json().catch(() => null);
}

export async function fetchMyEnrollments(token, academicYear) {
  const query = academicYear ? `?academicYear=${encodeURIComponent(academicYear)}` : "";
  const body = await request(`/enrollments/me${query}`, { token });
  return (body?.data ?? []).map((row) => ({
    id: row.id,
    offeringId: row.lectureOfferingId,
    lectureCode: row.lectureCode ?? null,
    lectureName: row.lectureName ?? null,
    academicYear: row.academicYear ?? null,
    semester: row.semester ?? null,
    groupNumber: row.groupNumber ?? null,
    staffName: row.staffName ?? null,
  }));
}

// Ogrencinin kendi haftalik izgarasi. `/calendar/weekly` herkese acik ve zaten
// `WeeklySchedule`'in bekledigi alanlari tasiyor; kayitli offering kimlikleriyle
// suzup izgara sekline ceviriyoruz. Ayri bir uca gerek yok.
//
// `type` (Zorunlu/Secmeli) burada yok: onu bilmek ders katalogunu da cekmek demek,
// oysa kisinin kendi programinda ders zaten secilmis durumda. Izgara eksik `type`'i
// zorunlu rengiyle ciziyor.
export async function fetchMyWeeklyEntries(token) {
  const enrolled = await fetchMyEnrollments(token);
  if (enrolled.length === 0) return [];

  const ids = new Set(enrolled.map((row) => row.offeringId));
  const res = await fetch(`${API}/calendar/weekly`).catch(() => null);
  if (!res?.ok) return [];
  const body = await res.json().catch(() => null);

  return (body?.data ?? [])
    .filter((slot) => ids.has(slot.offeringId))
    .map(toGridEntry)
    .filter(Boolean);
}

const DAY_KEYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
const FIRST_HOUR = 9;
const SLOT_COUNT = 12; // schedule-grid.js ile ayni: 09:00-20:50

const minutesOf = (time) => {
  const [h, m] = String(time ?? "").split(":");
  return Number(h) * 60 + Number(m ?? 0);
};

function toGridEntry(slot) {
  const day = DAY_KEYS.indexOf(slot.dayOfWeek);
  if (day === -1) return null;

  const start = minutesOf(slot.startTime);
  const end = minutesOf(slot.endTime);
  const index = Math.round((start - FIRST_HOUR * 60) / 60);
  if (index < 0 || index >= SLOT_COUNT) return null;

  return {
    id: slot.id,
    day,
    slot: index,
    span: Math.max(1, Math.ceil((end - start) / 60)),
    code: slot.lectureCode ?? "",
    name: slot.lectureName ?? slot.lectureCode ?? "",
    group: slot.groupNumber ?? 1,
    instructor: slot.staffName || "-",
    room: slot.classroom || "-",
    online: Boolean(slot.online),
    note: slot.groupNumber > 1 ? `Gr.${slot.groupNumber}` : null,
  };
}

export function enroll(offeringId, token) {
  return request("/enrollments", { method: "POST", token, body: { lectureOfferingId: offeringId } });
}

export function unenroll(offeringId, token) {
  return request(`/enrollments/${offeringId}`, { method: "DELETE", token });
}
