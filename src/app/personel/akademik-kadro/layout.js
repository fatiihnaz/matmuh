import SubHeader from "../../components/Header/SubHeader";

export default function RootLayout({ children }) {
  return (
    <>
        <SubHeader title={"Akademik Kadro"} subTitle={""} />
        {children}
    </>
  );
}
