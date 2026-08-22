import YonetimKurullarPage from "./components/YonetimKurullarPage";
import { getStaff } from "@/app/lib/staff.js";

export const metadata = {
  title: "Yönetim & Kurullar",
  description:
    "Matematik Mühendisliği Bölümü yönetimi ve Danışma Kurulu üyeleri.",
};

export default async function Page() {
  return <YonetimKurullarPage initialStaff={await getStaff()} />;
}
