import { getWeeklySchedule, termLabel } from "@/data/schedule";

import DersProgramiPage from "./components/DersProgramiPage";

export const metadata = {
  title: "Ders Programı - Lisans",
  description: "Matematik Mühendisliği Bölümü lisans haftalık ders programı.",
};

export default async function Page() {
  const { term, entries } = await getWeeklySchedule();
  const undergraduate = entries.filter((entry) =>
    entry.degreeLevels.includes("UNDERGRADUATE"),
  );
  return <DersProgramiPage entries={undergraduate} term={termLabel(term)} />;
}
