import { messages } from "./messages";

export const DEFAULT_LOCALE = "tr";

export function translate(locale, text) {
  if (!locale || locale === DEFAULT_LOCALE) return text;
  return messages[locale]?.[text] ?? text;
}
