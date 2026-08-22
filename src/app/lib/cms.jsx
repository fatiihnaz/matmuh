import { createCmsPage } from "inscribed/page";
import { CollectionRecord, CollectionRows } from "inscribed/collections";
import { revalidateCmsSlug, revalidateCmsCollection } from "inscribed/actions";

import { cmsConfig } from "./cms-config.js";
import { AppCmsProvider } from "./cms-provider.jsx";

export const { CmsPage, getCmsRoute, localePath, CollectionRegion, CollectionItem } =
  createCmsPage({
    config: cmsConfig,
    Provider: AppCmsProvider,
    collections: { CollectionRecord, CollectionRows },
    onAfterSave: revalidateCmsSlug,
    onAfterCollectionSave: revalidateCmsCollection,
  });
