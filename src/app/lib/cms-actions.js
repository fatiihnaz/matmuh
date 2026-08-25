"use server";

import { revalidateTag } from "next/cache";
import { revalidateCmsCollection } from "inscribed/actions";

// Haftalik program `/calendar/weekly` uzerinden geliyor ve bir saat onbellekleniyor
// (`src/data/schedule.js`). Etiket tanimliydi ama hicbir yerde dusurulmuyordu: editor
// CMS'ten grup ya da donem girdiginde degisiklik siteye bir saate kadar yansimiyordu.
// Bir donemin programini girerken bu, girdinin kaydedilip kaydedilmedigini anlamayi
// imkansiz hale getiriyor.
const FEEDS_SCHEDULE = new Set(["lecture-offerings", "academic-terms", "lectures"]);

export async function revalidateCollection(key, slug) {
  await revalidateCmsCollection(key, slug);
  if (FEEDS_SCHEDULE.has(key)) revalidateTag("schedule");
}
