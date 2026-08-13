// The one factory call: holds the config, the session strategy, and
// revalidation. Public read-only for now; the auth callbacks (getSession /
// deriveAdmin / onAfterSave) get added when the new auth layer lands.
import { createCmsPage } from "inscribed/page";
import { CmsProvider } from "inscribed";

import { cmsConfig } from "./cms-config.js";

export const { CmsPage, getCmsRoute, localePath } = createCmsPage({
  config: cmsConfig,
  Provider: CmsProvider,
});
