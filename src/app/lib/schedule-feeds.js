// The weekly schedule (fetched under the "schedule" tag) is built from
// offerings and their slots, terms, lecture codes and names, and staff names.
const FEEDS_SCHEDULE = new Set(["lecture-offerings", "academic-terms", "lectures", "staff"]);

export function scheduleTags(collections) {
  return collections.some((key) => FEEDS_SCHEDULE.has(key)) ? ["schedule"] : [];
}
