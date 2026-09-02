import { createCmsPage } from "inscribed/page";
import { CollectionProvider, CollectionRecord, CollectionRows } from "inscribed/collections";
import { revalidateCmsSlug } from "inscribed/actions";

import { revalidateCollection } from "./cms-actions.js";

import { cmsConfig } from "./cms-config.js";
import { AppCmsProvider } from "./cms-provider.jsx";
import { NotesPanel, NotesPanelIcon } from "@/app/components/CmsPanels/NotesPanel.jsx";
import {
  NOTES_PANEL_ACCENT,
  NOTES_PANEL_ID,
  NOTES_PANEL_LABEL,
} from "@/app/components/CmsPanels/notes-panel-meta.js";

export const { CmsPage, getCmsRoute, localePath, CollectionRegion, CollectionItem } =
  createCmsPage({
    config: cmsConfig,
    Provider: AppCmsProvider,
    collections: { CollectionProvider, CollectionRecord, CollectionRows },
    onAfterSave: revalidateCmsSlug,
    onAfterCollectionSave: revalidateCollection,
    panels: [
      {
        id: NOTES_PANEL_ID,
        label: NOTES_PANEL_LABEL,
        icon: <NotesPanelIcon />,
        accent: NOTES_PANEL_ACCENT,
        Component: NotesPanel,
        // Read by AppCmsProvider, not by inscribed: the drawer mounts for
        // editors too, and note review is the admins'.
        requiresRole: "ROLE_ADMIN",
      },
    ],
  });
