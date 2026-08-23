import { getWeeklySchedule, termLabel } from "@/data/schedule";

import LisansustuDersProgramiPage from "./components/LisansustuDersProgramiPage";

export const metadata = {
  title: "Ders Programı - Lisansüstü",
  description: "Matematik Mühendisliği Bölümü lisansüstü haftalık ders programı.",
};

const GRADUATE = new Set(["MASTERS", "DOCTORATE"]);

export default async function Page() {
  const { term, entries } = await getWeeklySchedule();
  const graduate = entries.filter((entry) =>
    entry.degreeLevels.some((level) => GRADUATE.has(level)),
  );
  return <LisansustuDersProgramiPage entries={graduate} term={termLabel(term)} />;
}
