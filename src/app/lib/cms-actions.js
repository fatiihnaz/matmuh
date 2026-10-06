"use server";

import { revalidateTag } from "next/cache";
import { revalidateCmsCollection } from "inscribed/actions";

import { scheduleTags } from "./schedule-feeds.js";

export async function revalidateCollection(key, slug) {
  await revalidateCmsCollection(key, slug);
  for (const tag of scheduleTags([key])) revalidateTag(tag, "max");
}
