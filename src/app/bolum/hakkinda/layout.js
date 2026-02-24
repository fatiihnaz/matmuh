import SubHeader from "../../components/Header/SubHeader";

export default function RootLayout({ children }) {
  return (
    <>
        <SubHeader title={"Bölüm Hakkında"} subTitle={"Matematik Mühendisliği; Tarih, Vizyon & Çalışma Alanları"} />
        {children}
    </>
  );
}
