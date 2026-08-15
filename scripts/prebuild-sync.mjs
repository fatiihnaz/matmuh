// Run cms-sync during `next build` only when a sync key is available; otherwise
// skip, so a build without the backend admin token (local dev, CI preview)
// still succeeds. POST /cms/sync needs ROLE_ADMIN, so pushing without a token
// would 403 and fail the build.
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

/** Read a var from the process env, falling back to .env (the CLI's file too). */
function readKey(name) {
  if (process.env[name]) return process.env[name];
  if (!existsSync(".env")) return "";
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq !== -1 && t.slice(0, eq).trim() === name) {
      return t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return "";
}

if (!readKey("CMS_SYNC_KEY")) {
  console.log("[cms-sync] CMS_SYNC_KEY not set — skipping manifest sync");
  process.exit(0);
}

execSync("cms-sync --app-root src/app --env .env", { stdio: "inherit" });
