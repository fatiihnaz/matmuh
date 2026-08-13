// Next 16 middleware (proxy convention). Two jobs: copy the visitor-facing
// pathname into x-pathname for <CmsPage>, and rewrite an unprefixed path onto
// the default locale's [locale] segment (so /bolum is served by /[locale]/bolum
// without "tr" ever reaching the address bar). Paths already carrying a known
// locale pass straight through.
import { createCmsMiddleware } from "inscribed/middleware";
import * as cms from "../cms.config.js";

export const proxy = createCmsMiddleware(cms);

export const config = {
  // Exclude API, Next internals, and any path with a file extension (a dot):
  // static assets like /main-logo.svg and metadata routes (robots.txt,
  // sitemap.xml) must not be rewritten onto the [locale] segment.
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
