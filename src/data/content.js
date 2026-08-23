import { cache } from "react";
import { getCmsCollection } from "inscribed/server";

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

const WINDOW = { limit: 100, sort: "publishedAt:desc" };

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
    id: item.id,
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
    gallery: (data.gallery ?? []).map((g) => ({
      src: g.image?.src ?? "",
      alt: g.image?.alt ?? "",
      caption: g.caption ?? null,
      width: 1600,
      height: 1067,
    })),
  };
}

function compare(a, b) {
  if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
  if (a.publishedAt !== b.publishedAt) return a.publishedAt < b.publishedAt ? 1 : -1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

const fetchCollection = cache(async (key) => {
  const { items } = await getCmsCollection(cmsConfig, key, WINDOW).catch(() => ({ items: [] }));
  return items.map(toAnnouncement).sort(compare);
});

const allAnnouncements = () => fetchCollection("announcements");
const allNews = () => fetchCollection("news");

function matches(item, { category, q }) {
  if (category && !item.categories.includes(category)) return false;
  if (q) {
    const needle = normalizeTr(q).trim();
    if (needle) {
      const hay = normalizeTr(`${item.title} ${item.summary ?? ""}`);
      if (!needle.split(/\s+/).every((word) => hay.includes(word))) return false;
    }
  }
  return true;
}

export const getAnnouncements = cache(async ({ category, q, limit, offset = 0 } = {}) => {
  const filtered = (await allAnnouncements()).filter((item) => matches(item, { category, q }));
  return {
    items: filtered.slice(offset, limit ? offset + limit : undefined),
    total: filtered.length,
  };
});

export const getNews = cache(async ({ limit, offset = 0 } = {}) => {
  const items = await allNews();
  return { items: items.slice(offset, limit ? offset + limit : undefined), total: items.length };
});

export const getAnnouncementBySlug = cache(
  async (slug) => (await allAnnouncements()).find((item) => item.slug === slug) ?? null,
);

export const getNewsBySlug = cache(
  async (slug) => (await allNews()).find((item) => item.slug === slug) ?? null,
);

export const getAdjacent = cache(async (slug) => {
  const items = await allAnnouncements();
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1) return { newer: null, older: null };
  const brief = (item) => (item ? { slug: item.slug, title: item.title } : null);
  return { newer: brief(items[index - 1]), older: brief(items[index + 1]) };
});

export const getCategoriesWithCounts = cache(async () => {
  const items = await allAnnouncements();
  return CONTENT_CATEGORIES.map((category) => ({
    ...category,
    count: items.filter((item) => item.categories.includes(category.id)).length,
  })).filter((category) => category.count > 0);
});

export const getAllSlugs = cache(async () => (await allAnnouncements()).map((item) => item.slug));

export const getAllNewsSlugs = cache(async () => (await allNews()).map((item) => item.slug));
