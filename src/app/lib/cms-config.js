// Serializable CMS config, safe to cross the RSC boundary as a prop. Imported
// by server modules (the page factory), so it uses inscribed/page's
// createCmsConfig, which stays callable during server render.
import { createCmsConfig } from "inscribed/page";
import { locales } from "../../../cms.config.js";

export const cmsConfig = createCmsConfig({
  baseUrl: process.env.CMS_URL,
  locales,
  adminLocale: "tr",
});
