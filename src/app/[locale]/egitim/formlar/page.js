import { Briefcase, BookOpen, Sun } from "lucide-react";

import RelatedPages from "@/app/components/RelatedPages";
import QuickLinks from "@/app/components/QuickLinks";
import FormsPage from "./components/FormsPage";

export const metadata = {
  title: "Formlar / Belgeler",
  description:
    "Matematik Mühendisliği Bölümü öğrenci dilekçeleri ve akademik-idari personel formları.",
};

const RELATED = [
  { label: "Staj İşlemleri", href: "/egitim/staj", icon: Briefcase },
  { label: "Yaz Okulu", href: "/egitim/yaz-okulu", icon: Sun },
  { label: "Müfredat", href: "/egitim/mufredat", icon: BookOpen },
];

export default function Page() {
  return (
    <FormsPage
      sidebar={
        <div className="flex flex-col gap-6">
          <RelatedPages items={RELATED} />
          <QuickLinks external title="Kurumsal Sistemler" />
        </div>
      }
    />
  );
}
