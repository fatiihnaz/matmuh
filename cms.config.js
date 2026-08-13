// Single source of truth for the site's content languages. Read by the
// middleware (src/proxy.js), the CMS config, and the `cms-sync` CLI. The first
// entry is the default locale: Turkish sits at the root with no prefix, English
// lives under /en.
export const locales = ["tr", "en"];
