import { cache } from "react";
import {
  CONTENT_CATEGORIES,
  HOME_CATEGORY_IDS,
  NEWS_CATEGORY_IDS,
  contentRecords,
} from "./contentData";

export { CONTENT_CATEGORIES, HOME_CATEGORY_IDS, NEWS_CATEGORY_IDS };

export const PAGE_SIZE = 20;

export function announcementHref(item) {
  return `/duyurular/${item.slug}`;
}

const ALLOWED_TAGS = new Set(["p", "br", "strong", "em", "u", "a", "ul", "ol", "li", "h3", "h4"]);

function sanitize(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, (tag) => {
    const parsed = /^<(\/?)\s*([a-zA-Z0-9]+)/.exec(tag);
    if (!parsed) return "";
    const [, closing, rawName] = parsed;
    const name = rawName.toLowerCase();
    if (!ALLOWED_TAGS.has(name)) return "";
    if (closing) return `</${name}>`;
    if (name === "br") return "<br />";
    if (name !== "a") return `<${name}>`;

    const href = /href\s*=\s*"([^"]*)"/i.exec(tag)?.[1] ?? "";
    if (!/^(https?:\/\/|\/|mailto:)/i.test(href)) return "<a>";
    const external = /^https?:\/\//i.test(href);
    return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>`;
  });
}

const FOLD = { İ: "i", I: "i", ı: "i", Ş: "s", ş: "s", Ğ: "g", ğ: "g", Ü: "u", ü: "u", Ö: "o", ö: "o", Ç: "c", ç: "c", Â: "a", â: "a", Î: "i", î: "i", Û: "u", û: "u" };

export function normalizeTr(value) {
  return String(value ?? "")
    .replace(/[İIıŞşĞğÜüÖöÇçÂâÎîÛû]/g, (c) => FOLD[c])
    .toLowerCase();
}

function toAnnouncement(raw) {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    summary: raw.summary ?? null,
    body: sanitize(raw.body),
    categories: raw.categories ?? [],
    publishedAt: raw.publishedAt,
    updatedAt: raw.updatedAt ?? null,
    pinned: Boolean(raw.pinned),
    attachments: (raw.attachments ?? []).map((a) => ({
      label: a.label,
      href: a.href,
      kind: (a.kind ?? "").toLowerCase(),
      size: a.size ?? 0,
    })),
    gallery: (raw.gallery ?? []).map((g) => ({
      src: g.src,
      alt: g.alt ?? "",
      caption: g.caption ?? null,
      width: g.width ?? 1600,
      height: g.height ?? 1067,
    })),
  };
}

function compare(a, b) {
  if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
  if (a.publishedAt !== b.publishedAt) return a.publishedAt < b.publishedAt ? 1 : -1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

const allSorted = cache(() => contentRecords.map(toAnnouncement).sort(compare));

function matches(item, { category, categoriesAny, excludeCategory, q }) {
  if (category && !item.categories.includes(category)) return false;
  if (categoriesAny && !item.categories.some((c) => categoriesAny.includes(c))) return false;
  if (excludeCategory && item.categories.includes(excludeCategory)) return false;
  if (q) {
    const needle = normalizeTr(q).trim();
    if (needle) {
      const hay = normalizeTr(`${item.title} ${item.summary ?? ""}`);
      if (!needle.split(/\s+/).every((word) => hay.includes(word))) return false;
    }
  }
  return true;
}

export const getAnnouncements = cache(
  async ({ category, categoriesAny, excludeCategory, q, limit, offset = 0 } = {}) => {
    const filtered = allSorted().filter((item) =>
      matches(item, { category, categoriesAny, excludeCategory, q }),
    );
    const items = filtered.slice(offset, limit ? offset + limit : undefined);
    return { items, total: filtered.length };
  },
);

export const getNews = cache(async ({ limit, offset = 0 } = {}) =>
  getAnnouncements({ categoriesAny: NEWS_CATEGORY_IDS, excludeCategory: "sinav", limit, offset }),
);

export const getAnnouncementBySlug = cache(async (slug) =>
  allSorted().find((item) => item.slug === slug) ?? null,
);

export const getAdjacent = cache(async (slug) => {
  const items = allSorted();
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1) return { newer: null, older: null };
  const brief = (item) => (item ? { slug: item.slug, title: item.title } : null);
  return { newer: brief(items[index - 1]), older: brief(items[index + 1]) };
});

export const getCategoriesWithCounts = cache(async () => {
  const items = allSorted();
  return CONTENT_CATEGORIES.map((category) => ({
    ...category,
    count: items.filter((item) => item.categories.includes(category.id)).length,
  })).filter((category) => category.count > 0);
});

export const getAllSlugs = cache(async () => allSorted().map((item) => item.slug));
