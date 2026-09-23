import { localePath } from "./cms.jsx";
import { locales } from "../../../cms.config.mjs";

const DEFAULT_LOCALE = locales[0];

export function alternatePaths(item, basePath) {
  const own = item.locale ?? DEFAULT_LOCALE;
  const paths = { [own]: localePath(`${basePath}/${item.slug}`, own) };
  for (const sibling of item.translations ?? []) {
    if (!sibling?.locale || !sibling?.slug || sibling.locale === own) continue;
    paths[sibling.locale] = localePath(`${basePath}/${sibling.slug}`, sibling.locale);
  }
  return paths;
}

export function alternateLanguages(item, basePath) {
  const own = item.locale ?? DEFAULT_LOCALE;
  const entries = [[own, `${basePath}/${item.slug}`]];

  for (const sibling of item.translations ?? []) {
    if (!sibling?.locale || !sibling?.slug) continue;
    if (sibling.locale === own) continue;
    entries.push([sibling.locale, `${basePath}/${sibling.slug}`]);
  }

  const languages = {};
  for (const [locale, path] of entries) {
    languages[locale] = localePath(path, locale);
  }

  const canonicalEntry = entries.find(([locale]) => locale === DEFAULT_LOCALE) ?? entries[0];
  languages["x-default"] = localePath(canonicalEntry[1], canonicalEntry[0]);

  return languages;
}
