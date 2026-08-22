const SAFE = /^(https?:\/\/|mailto:|tel:|\/|#|\.\/|\.\.\/)/i;

export function safeHref(href) {
  const value = typeof href === "string" ? href.trim() : "";
  return SAFE.test(value) ? value : "";
}

export function isExternalHref(href) {
  return /^https?:\/\//i.test(typeof href === "string" ? href.trim() : "");
}
