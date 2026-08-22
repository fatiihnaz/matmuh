import InternshipPage from "./components/InternshipPage";
import { getStaff } from "@/app/lib/staff.js";

export const metadata = {
  title: "Staj İşlemleri",
  description:
    "Matematik Mühendisliği Bölümü zorunlu staj esasları, süreç adımları, başvuru ve değerlendirme belgeleri.",
};

export default async function Page() {
  return <InternshipPage initialStaff={await getStaff()} />;
}
