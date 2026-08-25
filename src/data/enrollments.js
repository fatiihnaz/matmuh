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

export function enroll(offeringId, token) {
  return request("/enrollments", { method: "POST", token, body: { lectureOfferingId: offeringId } });
}

export function unenroll(offeringId, token) {
  return request(`/enrollments/${offeringId}`, { method: "DELETE", token });
}
