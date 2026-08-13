import { notFound } from "next/navigation";

// [locale] is a dynamic segment, so it greedily matches any single path
// segment. Reject anything that isn't a real locale, otherwise a missing static
// file (/whatever.png) falls through to this segment and soft-404s as the home
// page instead of returning a real 404.
const LOCALES = ["tr", "en"];

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!LOCALES.includes(locale)) notFound();
  return children;
}
