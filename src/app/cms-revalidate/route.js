import { createRevalidateHandler } from "inscribed/revalidate";

import { scheduleTags } from "../lib/schedule-feeds.js";

// The backend reports here what it changed without the drawer (a bot, an import).
export const POST = createRevalidateHandler({
  secret: process.env.CMS_REVALIDATE_SECRET,
  tags: scheduleTags,
});
