import { messages } from "./messages";

export const DEFAULT_LOCALE = "tr";

export function translate(locale, text, vars) {
  const template =
    !locale || locale === DEFAULT_LOCALE ? text : (messages[locale]?.[text] ?? text);
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
}

export function localizeTerm(t, label) {
  if (!label) return label;
  return String(label).replace(/(Güz|Bahar|Yaz)( Yarıyılı)?$/, (match, season, suffix) =>
    suffix ? t("{season} Yarıyılı", { season: t(season) }) : t(season),
  );
}
