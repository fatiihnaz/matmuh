import { getCmsCollection } from "inscribed/server";

import { cmsConfig } from "./cms-config.js";

export async function getStaff() {
  const { items } = await getCmsCollection(cmsConfig, "staff", { limit: 100 }).catch(() => ({
    items: [],
  }));
  return items.map((item) => ({ ...item.data, slug: item.slug }));
}
