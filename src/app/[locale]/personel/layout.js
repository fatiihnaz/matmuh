import SubHeader from "@/app/components/Header/SubHeader";

export default function RootLayout({ children }) {
  return (
    <>
      <SubHeader
        title="Akademik Personel"
        subTitle="Bölüm akademik ve idari kadro listesi"
      />
      {children}
    </>
  );
}