import { getCmsRoute } from "@/app/lib/cms.jsx";
import { translate } from "@/i18n";

export default async function NewTabHint() {
  const { locale } = await getCmsRoute();
  return (
    <span className="sr-only"> {translate(locale, "(yeni sekmede açılır)")}</span>
  );
}
