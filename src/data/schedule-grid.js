export const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

export const DAY_KEYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

export const FIRST_HOUR = 9;

export const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => {
  const hour = String(FIRST_HOUR + i).padStart(2, "0");
  return `${hour}.00 - ${hour}.50`;
});

export function coalesceEntries(entries) {
  const byKey = new Map();
  for (const e of entries) {
    const key = `${e.offeringId ?? `${e.code}-${e.group}`}-${e.day}-${e.room}-${e.online}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(e);
  }

  const out = [];
  for (const group of byKey.values()) {
    group.sort((a, b) => a.slot - b.slot);
    let run = null;
    for (const e of group) {
      if (run && e.slot <= run.slot + run.span) {
        run.span = Math.max(run.span, e.slot + e.span - run.slot);
        continue;
      }
      run = { ...e };
      out.push(run);
    }
  }
  return out;
}
