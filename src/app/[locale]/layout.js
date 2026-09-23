import { notFound } from "next/navigation";

import { CmsPage } from "@/app/lib/cms.jsx";
import { translate } from "@/i18n";
import { AlternateLocaleProvider } from "@/app/lib/alternate-locale.jsx";
import HtmlLang from "@/app/lib/html-lang.jsx";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer";
import ScrollToTop from "@/app/components/ScrollToTop";
import { locales } from "../../../cms.config.mjs";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  return (
    <CmsPage locale={locale}>
      <AlternateLocaleProvider>
        <HtmlLang />
        <div className="flex flex-col min-h-svh">
          <a
            href="#icerik"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-500 focus:shadow-lg"
          >
            {translate(locale, "İçeriğe atla")}
          </a>
          <Header />
          <main id="icerik" className="flex-1">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </AlternateLocaleProvider>
    </CmsPage>
  );
}
