// Single source of truth for the site's content languages and the sync
// credential. Read by the middleware (src/proxy.js), the CMS config, and the
// cms-sync CLI. It is .mjs (not .js) because the CLI is plain Node: with no
// "type":"module" in package.json a .js here would be parsed as CommonJS and
// its ESM exports would throw. The first locale is the default: Turkish at the
// root, English under /en.
export const locales = ["tr", "en"];

// For the cms-sync CLI only. baseUrl is the backend root; getServiceToken is the
// admin credential for POST /cms/sync. It returns "" until CMS_SYNC_KEY is set,
// and the guarded prebuild skips the sync in that case so a build never fails
// for a missing token.
export const baseUrl = process.env.CMS_URL;
export const getServiceToken = async () => process.env.CMS_SYNC_KEY ?? "";
