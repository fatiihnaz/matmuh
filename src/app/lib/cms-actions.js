"use server";

import { revalidateTag } from "next/cache";
import { revalidateCmsCollection } from "inscribed/actions";

const FEEDS_SCHEDULE = new Set(["lecture-offerings", "academic-terms", "lectures"]);

export async function revalidateCollection(key, slug) {
  await revalidateCmsCollection(key, slug);
  if (FEEDS_SCHEDULE.has(key)) revalidateTag("schedule");
}
