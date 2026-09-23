import { cache } from "react";
import { getCmsCollection, getCmsCollectionItem } from "inscribed/server";

import { cmsConfig } from "@/app/lib/cms-config.js";
import { DEFAULT_LOCALE } from "@/i18n";
import { CONTENT_CATEGORIES, announcementFromData } from "./content-shape";

export { CONTENT_CATEGORIES };

export const HOME_CATEGORY_IDS = ["sinav", "mezuniyet", "kariyer"];

export const PAGE_SIZE = 20;

const SORT = "featured:desc,publishedAt:desc";
const MAX_PAGE = 100;

const withLocale = (path, locale) =>
  locale && locale !== DEFAULT_LOCALE ? `/${locale}${path}` : path;

export function announcementHref(item, locale) {
  return withLocale(`/duyurular/${item.slug}`, locale);
}

export function newsHref(item, locale) {
  return withLocale(`/haberler/${item.slug}`, locale);
}

const FOLD = { İ: "i", I: "i", ı: "i", Ş: "s", ş: "s", Ğ: "g", ğ: "g", Ü: "u", ü: "u", Ö: "o", ö: "o", Ç: "c", ç: "c", Â: "a", â: "a", Î: "i", î: "i", Û: "u", û: "u" };

export function normalizeTr(value) {
  return String(value ?? "")
    .replace(/[İIıŞşĞğÜüÖöÇçÂâÎîÛû]/g, (c) => FOLD[c])
    .toLowerCase();
}

function toAnnouncement(item) {
  return {
    ...announcementFromData(item.data ?? {}),
    id: item.id ?? item.slug,
    slug: item.slug,
    updatedAt: item.updatedAt ?? null,
    locale: item.locale ?? null,
    translationGroupId: item.translationGroupId ?? null,
    translations: item.translations ?? [],
  };
}

const emptyPage = { items: [], total: 0 };

const queryPage = cache(async (key, category, q, limit, offset, locale) => {
  const filter = {};
  if (category) filter.tags = category;
  if (q) filter.q = q;

  const page = await getCmsCollection(cmsConfig, key, {
    ...(Object.keys(filter).length > 0 ? { filter } : {}),
    ...(locale ? { locale } : {}),
    sort: SORT,
    limit: limit ?? MAX_PAGE,
    offset,
  }).catch(() => emptyPage);

  return { items: (page.items ?? []).map(toAnnouncement), total: page.total ?? 0 };
});

const countOnly = cache(async (key, category, locale) => {
  const page = await getCmsCollection(cmsConfig, key, {
    filter: { tags: category },
    ...(locale ? { locale } : {}),
    limit: 1,
  }).catch(() => emptyPage);
  return page.total ?? 0;
});

const allOrdered = cache(async (key, locale) => {
  const out = [];
  for (let offset = 0; ; offset += MAX_PAGE) {
    const page = await queryPage(key, null, null, MAX_PAGE, offset, locale);
    out.push(...page.items);
    if (out.length >= page.total || page.items.length === 0) break;
  }
  return out;
});

const byRank = (a, b) => {
  if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
  return String(b.publishedAt).localeCompare(String(a.publishedAt));
};

const matches = (item, category, q) => {
  if (category && !(item.categories ?? []).includes(category)) return false;
  if (!q) return true;
  const needle = normalizeTr(q);
  return [item.title, item.summary].some((field) =>
    normalizeTr(field).includes(needle),
  );
};

const mergedWithFallback = cache(async (key, locale) => {
  const [translated, fallback] = await Promise.all([
    allOrdered(key, locale),
    allOrdered(key, DEFAULT_LOCALE),
  ]);

  const covered = new Set(
    translated.map((item) => item.translationGroupId).filter(Boolean),
  );
  const missing = fallback.filter(
    (item) => !item.translationGroupId || !covered.has(item.translationGroupId),
  );

  return [...translated, ...missing].sort(byRank);
});

const orderedFor = async (key, locale) =>
  !locale || locale === DEFAULT_LOCALE ? allOrdered(key, locale) : mergedWithFallback(key, locale);

const localePage = async (key, category, q, limit, offset, locale) => {
  if (!locale || locale === DEFAULT_LOCALE) {
    return queryPage(key, category ?? null, q || null, limit, offset, locale);
  }

  const all = await mergedWithFallback(key, locale);
  const items = all.filter((item) => matches(item, category, q));
  const size = limit ?? MAX_PAGE;
  return { items: items.slice(offset, offset + size), total: items.length };
};

export const getAnnouncements = cache(async ({ category, q, limit, offset = 0, locale } = {}) =>
  localePage("announcements", category ?? null, q || null, limit, offset, locale),
);

export const getNews = cache(async ({ limit, offset = 0, locale } = {}) =>
  localePage("news", null, null, limit, offset, locale),
);

const bySlug = cache(async (key, slug) => {
  const item = await getCmsCollectionItem(cmsConfig, key, slug).catch(() => null);
  return item ? toAnnouncement(item) : null;
});

export const getAnnouncementBySlug = cache(async (slug) => bySlug("announcements", slug));

export const getNewsBySlug = cache(async (slug) => bySlug("news", slug));

export const getAdjacent = cache(async (slug, locale, key = "announcements") => {
  const items = await orderedFor(key, locale);
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1) return { newer: null, older: null };
  const brief = (item) => (item ? { slug: item.slug, title: item.title } : null);
  return { newer: brief(items[index - 1]), older: brief(items[index + 1]) };
});

export const getCategoriesWithCounts = cache(async (locale) => {
  if (locale && locale !== DEFAULT_LOCALE) {
    const all = await mergedWithFallback("announcements", locale);
    return CONTENT_CATEGORIES.map((category) => ({
      ...category,
      count: all.filter((item) => (item.categories ?? []).includes(category.id))
        .length,
    })).filter((category) => category.count > 0);
  }

  const counts = await Promise.all(
    CONTENT_CATEGORIES.map(async (category) => ({
      ...category,
      count: await countOnly("announcements", category.id, locale),
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
