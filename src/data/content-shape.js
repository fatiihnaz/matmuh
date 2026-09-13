const sameOrigin = (fileUrl) => {
  if (!fileUrl) return fileUrl ?? "";
  try {
    const { pathname, search } = new URL(fileUrl);
    return pathname.startsWith("/api/") ? `${pathname}${search}` : fileUrl;
  } catch {
    return fileUrl;
  }
};

const extensionOf = (fileName) => {
  const match = /\.([A-Za-z0-9]{1,6})$/.exec(String(fileName ?? ""));
  return match ? match[1] : null;
};

export const CONTENT_CATEGORIES = [
  { id: "sinav", label: "Sınav & Program" },
  { id: "mezuniyet", label: "Mezuniyet" },
  { id: "staj", label: "Staj" },
  { id: "kariyer", label: "Kariyer & Etkinlik" },
  { id: "genel", label: "Genel" },
];

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "hr",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "del",
  "strike",
  "a",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "pre",
  "code",
]);

export function sanitize(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, (tag) => {
    const parsed = /^<(\/?)\s*([a-zA-Z0-9]+)/.exec(tag);
    if (!parsed) return "";
    const [, closing, rawName] = parsed;
    const name = rawName.toLowerCase();
    if (!ALLOWED_TAGS.has(name)) return "";
    if (closing) return `</${name}>`;
    if (name === "br") return "<br />";
    if (name === "hr") return "<hr />";
    if (name !== "a") return `<${name}>`;

    const href = /href\s*=\s*"([^"]*)"/i.exec(tag)?.[1] ?? "";
    if (!/^(https?:\/\/|\/|mailto:)/i.test(href)) return "<a>";
    const external = /^https?:\/\//i.test(href);
    return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>`;
  });
}

export function announcementFromData(data) {
  return {
    title: data.title ?? "",
    summary: data.summary ?? null,
    body: sanitize(data.body),
    categories: data.tags ?? [],
    publishedAt: data.publishedAt ?? "",
    pinned: Boolean(data.featured),
    coverImage: data.coverImage ?? null,
    attachments: (data.attachments ?? []).map((a) => {
      const f = a.file ?? a;
      return {
        label: a.name ?? f.name ?? "",
        href: sameOrigin(f.url),
        previewHref: f.previewUrl ? sameOrigin(f.previewUrl) : null,
        kind: (a.type ?? extensionOf(f.name) ?? "").toLowerCase(),
        size: a.size ?? f.size ?? 0,
      };
    }),
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
