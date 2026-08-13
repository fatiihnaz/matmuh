// The one factory call: holds the config, provider, and revalidation. The
// server stays public (admin is resolved client-side in AppCmsProvider from the
// in-memory token); onAfterSave drops the ISR cache for the published locale.
import { createCmsPage } from "inscribed/page";
import { revalidateCmsSlug } from "inscribed/actions";

import { cmsConfig } from "./cms-config.js";
import { AppCmsProvider } from "./cms-provider.jsx";

export const { CmsPage, getCmsRoute, localePath } = createCmsPage({
  config: cmsConfig,
  Provider: AppCmsProvider,
  onAfterSave: revalidateCmsSlug,
});
