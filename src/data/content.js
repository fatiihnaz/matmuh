import { cache } from "react";
import { getCmsCollection, getCmsCollectionItem } from "inscribed/server";

import { cmsConfig } from "@/app/lib/cms-config.js";

export const CONTENT_CATEGORIES = [
  { id: "sinav", label: "Sınav & Program" },
  { id: "mezuniyet", label: "Mezuniyet" },
  { id: "staj", label: "Staj" },
  { id: "kariyer", label: "Kariyer & Etkinlik" },
  { id: "genel", label: "Genel" },
];

export const HOME_CATEGORY_IDS = ["sinav", "mezuniyet", "kariyer"];

export const PAGE_SIZE = 20;

const SORT = "featured:desc,publishedAt:desc";
const MAX_PAGE = 100;

export function announcementHref(item) {
  return `/duyurular/${item.slug}`;
}

export function newsHref(item) {
  return `/haberler/${item.slug}`;
}

const FOLD = { İ: "i", I: "i", ı: "i", Ş: "s", ş: "s", Ğ: "g", ğ: "g", Ü: "u", ü: "u", Ö: "o", ö: "o", Ç: "c", ç: "c", Â: "a", â: "a", Î: "i", î: "i", Û: "u", û: "u" };

export function normalizeTr(value) {
  return String(value ?? "")
    .replace(/[İIıŞşĞğÜüÖöÇçÂâÎîÛû]/g, (c) => FOLD[c])
    .toLowerCase();
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

function toAnnouncement(item) {
  const data = item.data ?? {};
  return {
    id: item.id ?? item.slug,
    slug: item.slug,
    title: data.title ?? "",
    summary: data.summary ?? null,
    body: sanitize(data.body),
    categories: data.tags ?? [],
    publishedAt: data.publishedAt ?? "",
    updatedAt: item.updatedAt ?? null,
    locale: item.locale ?? null,
    translations: item.translations ?? [],
    pinned: Boolean(data.featured),
    coverImage: data.coverImage ?? null,
    attachments: (data.attachments ?? []).map((a) => ({
      label: a.name ?? "",
      href: a.url ?? "",
      kind: (a.type ?? "").toLowerCase(),
      size: a.size ?? 0,
    })),
    gallery: (data.gallery ?? [])
      .filter((g) => g.image?.src)
      .map((g) => ({
        src: g.image.src,
        alt: g.image.alt ?? "",
        caption: g.caption ?? null,
        width: 1600,
        height: 1067,
      })),
  };
}

const emptyPage = { items: [], total: 0 };

const queryPage = cache(async (key, category, q, limit, offset) => {
  const filter = {};
  if (category) filter.tags = category;
  if (q) filter.q = q;

  const page = await getCmsCollection(cmsConfig, key, {
    ...(Object.keys(filter).length > 0 ? { filter } : {}),
    sort: SORT,
    limit: limit ?? MAX_PAGE,
    offset,
  }).catch(() => emptyPage);

  return { items: (page.items ?? []).map(toAnnouncement), total: page.total ?? 0 };
});

const countOnly = cache(async (key, category) => {
  const page = await getCmsCollection(cmsConfig, key, {
    filter: { tags: category },
    limit: 1,
  }).catch(() => emptyPage);
  return page.total ?? 0;
});

const allOrdered = cache(async (key) => {
  const out = [];
  for (let offset = 0; ; offset += MAX_PAGE) {
    const page = await queryPage(key, null, null, MAX_PAGE, offset);
    out.push(...page.items);
    if (out.length >= page.total || page.items.length === 0) break;
  }
  return out;
});

export const getAnnouncements = cache(async ({ category, q, limit, offset = 0 } = {}) =>
  queryPage("announcements", category ?? null, q || null, limit, offset),
);

export const getNews = cache(async ({ limit, offset = 0 } = {}) =>
  queryPage("news", null, null, limit, offset),
);

const bySlug = cache(async (key, slug) => {
  const item = await getCmsCollectionItem(cmsConfig, key, slug).catch(() => null);
  return item ? toAnnouncement(item) : null;
});

export const getAnnouncementBySlug = cache(async (slug) => bySlug("announcements", slug));

export const getNewsBySlug = cache(async (slug) => bySlug("news", slug));

export const getAdjacent = cache(async (slug) => {
  const items = await allOrdered("announcements");
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1) return { newer: null, older: null };
  const brief = (item) => (item ? { slug: item.slug, title: item.title } : null);
  return { newer: brief(items[index - 1]), older: brief(items[index + 1]) };
});

export const getCategoriesWithCounts = cache(async () => {
  const counts = await Promise.all(
    CONTENT_CATEGORIES.map(async (category) => ({
      ...category,
      count: await countOnly("announcements", category.id),
    })),
  );
  return counts.filter((category) => category.count > 0);
});

export const getAllSlugs = cache(async () =>
  (await allOrdered("announcements")).map((item) => item.slug),
);

export const getAllNewsSlugs = cache(async () =>
  (await allOrdered("news")).map((item) => item.slug),
);
