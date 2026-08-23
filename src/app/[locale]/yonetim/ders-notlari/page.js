import NoteAdminPage from "./components/NoteAdminPage";

export const metadata = {
  title: "Not Yönetimi",
  description: "Yüklenen ders notlarının onay ve yönetim ekranı.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <NoteAdminPage />;
}
