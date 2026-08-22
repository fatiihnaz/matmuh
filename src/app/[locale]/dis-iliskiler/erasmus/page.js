import ErasmusPage from "./components/ErasmusPage";
import { getStaff } from "@/app/lib/staff.js";

export const metadata = {
  title: "Erasmus+",
  description:
    "Matematik Mühendisliği Bölümü Erasmus+ koordinatörleri, ikili anlaşmalar ve staj hareketliliği.",
};

export default async function Page() {
  return <ErasmusPage initialStaff={await getStaff()} />;
}
