import SubHeader from "../../components/Header/SubHeader";

export default function RootLayout({ children }) {
  return (
    <>
        <SubHeader title={"Bilgi Kaynakları"} subTitle={"Eğitim ve araştırma süreçlerinizi destekleyen dijital kaynaklar"} />
        {children}
    </>
  );
}
