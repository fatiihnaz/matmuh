import { getWeeklySchedule } from "@/data/schedule";
import { buildIcs } from "@/lib/calendar-export";
import { translate } from "@/i18n";

const OFFERING = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_OFFERINGS = 40;

export async function GET(request) {
  const url = new URL(request.url);
  const ids = new Set(
    (url.searchParams.get("o") ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter((id) => OFFERING.test(id))
      .slice(0, MAX_OFFERINGS),
  );
  if (ids.size === 0) return new Response("Not Found", { status: 404 });

  const locale = url.searchParams.get("lang") === "en" ? "en" : "tr";
  const t = (text, vars) => translate(locale, text, vars);

  const { term, entries } = await getWeeklySchedule({ locale });
  const text = buildIcs(
    entries.filter((entry) => ids.has(entry.offeringId)),
    term,
    { t, name: t("YTÜ Ders Programım") },
  );
  if (!text) return new Response("Bad Gateway", { status: 502 });

  return new Response(text, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="ders-programi.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
