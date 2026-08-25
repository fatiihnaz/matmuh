import { createCmsPage } from "inscribed/page";
import { CollectionRecord, CollectionRows } from "inscribed/collections";
import { revalidateCmsSlug } from "inscribed/actions";

import { revalidateCollection } from "./cms-actions.js";

import { cmsConfig } from "./cms-config.js";
import { AppCmsProvider } from "./cms-provider.jsx";

export const { CmsPage, getCmsRoute, localePath, CollectionRegion, CollectionItem } =
  createCmsPage({
    config: cmsConfig,
    Provider: AppCmsProvider,
    collections: { CollectionRecord, CollectionRows },
    onAfterSave: revalidateCmsSlug,
    onAfterCollectionSave: revalidateCollection,
  });
