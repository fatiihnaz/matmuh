/**
 * @file The drawer's design vocabulary, re-derived for our panel.
 *
 * inscribed ships these as `shared/style/tokens.js` and `admin/drawer-styles.js`
 * but exports neither: `inscribed/panels` carries behaviour (`useCmsPanel`,
 * `PanelStack`) and no styling. So a panel that wants to sit beside Page and
 * Collections without looking like a guest has to restate the values, which is
 * what this file is. Every one resolves through the same `--ins-*` variable
 * with the same stock fallback, so `theme` in cms-config still drives them.
 *
 * Kept apart from the components so the day inscribed does export its tokens,
 * this is the one file that goes.
 */

const sans =
  'var(--ins-font-sans, "Inter Tight", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif)';
const mono =
  'var(--ins-font-mono, ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace)';

export const F = { sans, mono };

export const T = {
  textHi: "color-mix(in srgb, var(--ins-text, #fff) 96%, transparent)",
  text: "color-mix(in srgb, var(--ins-text, #fff) 82%, transparent)",
  mid: "color-mix(in srgb, var(--ins-text, #fff) 58%, transparent)",
  muted: "color-mix(in srgb, var(--ins-text, #fff) 38%, transparent)",
  faint: "color-mix(in srgb, var(--ins-text, #fff) 22%, transparent)",

  bg: "var(--ins-bg, #1c1815)",
  surface1: "color-mix(in srgb, var(--ins-surface, #fff) 2.5%, transparent)",
  surface2: "color-mix(in srgb, var(--ins-surface, #fff) 5%, transparent)",
  surface3: "color-mix(in srgb, var(--ins-surface, #fff) 8%, transparent)",
  hairline: "color-mix(in srgb, var(--ins-surface, #fff) 6%, transparent)",
  border: "color-mix(in srgb, var(--ins-surface, #fff) 10%, transparent)",

  ok: "rgb(150, 210, 160)",
  warn: "rgb(232, 192, 130)",
  danger: "var(--ins-danger, rgb(232, 132, 152))",
};

// Radius steps, the drawer's internal scale (not themeable there either).
export const R = { badge: 4, sm: 6, btn: 7, md: 8, pill: 99 };

// No flex or overflow of its own: inside `PanelStack` each view sits in a
// layer that is already `position: absolute; inset: 0` and scrolls itself, so a
// view that also claimed the scroll would nest two of them.
export const listStyle = {
  margin: 0,
  padding: "6px 16px 16px",
  listStyle: "none",
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

// Two stacked lines per row want more air than a hairline but less than the
// block list's 10px, same call the collections list makes.
export const tightListStyle = { ...listStyle, gap: 4 };

// 32px of control plus one more line puts the box at 44.
export const rowStyle = {
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "100%",
  minHeight: 44,
  padding: "7px 12px",
  border: 0,
  background: "transparent",
  borderRadius: R.md,
  cursor: "pointer",
  textAlign: "left",
  fontFamily: "inherit",
  color: "inherit",
};

export const rowTextColStyle = {
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export const rowIdentityStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  minWidth: 0,
};

export const rowPropertyStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  minWidth: 0,
};

export const rowTitleStyle = {
  flex: "0 1 auto",
  minWidth: 0,
  font: `500 12px/1.2 ${sans}`,
  color: T.text,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

// Identifiers are mono here exactly as block paths and collection keys are.
export const rowCodeStyle = {
  flexShrink: 0,
  font: `500 11px/1.2 ${mono}`,
  color: T.mid,
  whiteSpace: "nowrap",
};

export const rowMetaStyle = {
  flex: "1 1 auto",
  minWidth: 0,
  font: `11px/1.2 ${sans}`,
  color: T.muted,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const rowCountStyle = {
  flexShrink: 0,
  font: `500 10px/1 ${sans}`,
  fontVariantNumeric: "tabular-nums",
  color: T.faint,
  whiteSpace: "nowrap",
};

export const rowIconStyle = {
  flexShrink: 0,
  width: 20,
  height: 20,
  borderRadius: R.badge,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

export const chevronStyle = {
  display: "inline-flex",
  flexShrink: 0,
  color: T.muted,
};

// Sentence case at the panel's own size: the drawer says section labels this
// way rather than in tracked-out micro-caps.
export const groupLabelStyle = {
  padding: "12px 12px 4px",
  font: `500 11px/1 ${sans}`,
  letterSpacing: "-0.005em",
  color: T.muted,
};

/**
 * Hover, focus ring and the sliding chevron come from the drawer's own
 * stylesheet, which is already in the document. Undocumented class names, so
 * they are named once here: if a future inscribed renames them the rows lose
 * their hover and nothing else.
 */
export const ROW_CLASS = "inscribed-collection-row";
export const SUBROW_CLASS = "inscribed-region-row";
export const CHEVRON_CLASS = "inscribed-list-chevron";

// ---------------------------------------------------------------------------
// Tab strip: the drawer's own switcher (the collection strip, the Sayfa/Genel
// tabs). Fixed 32px tab height so a strip with count badges and one without
// still line up; the active tab is carried by a sliding 2px underline rather
// than a fill.
// ---------------------------------------------------------------------------

export const tabBarStyle = {
  display: "flex",
  alignItems: "stretch",
  gap: 2,
  padding: "0 16px",
  borderBottom: `1px solid ${T.hairline}`,
  position: "relative",
};

export const tabBarScrollStyle = {
  display: "flex",
  gap: 2,
  flex: 1,
  overflowX: "auto",
  scrollBehavior: "smooth",
  position: "relative",
};

export const tabBarChevronStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 22,
  marginBottom: -1,
  background: "transparent",
  border: 0,
  color: T.muted,
  cursor: "pointer",
  padding: 0,
  fontFamily: "inherit",
  flexShrink: 0,
};

export const tabButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  boxSizing: "border-box",
  minHeight: 32,
  padding: "7px 10px",
  marginBottom: -1,
  background: "transparent",
  border: 0,
  borderBottom: "2px solid transparent",
  color: T.muted,
  font: `500 12px/1 ${sans}`,
  letterSpacing: "-0.005em",
  cursor: "pointer",
  transition: "color 140ms ease",
  fontFamily: "inherit",
  whiteSpace: "nowrap",
};

export const tabButtonActiveStyle = { color: T.textHi };

export const tabCountStyle = {
  font: `500 10px/1 ${sans}`,
  fontVariantNumeric: "tabular-nums",
  padding: "3px 6px",
  borderRadius: R.pill,
  background: T.surface2,
  color: T.faint,
};

export const tabCountActiveStyle = { color: T.mid, background: T.surface3 };

export const TAB_CLASS = "inscribed-tab";
export const TABBAR_SCROLL_CLASS = "inscribed-tabbar-scroll";
export const TABBAR_CHEVRON_CLASS = "inscribed-tabbar-chevron";
