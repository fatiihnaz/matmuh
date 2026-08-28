/**
 * @file Identity and accent of the note panel, kept in a plain module because
 * both sides read them. A "use client" module's plain exports reach a Server
 * Component as client references rather than values, so the descriptor in
 * cms.jsx cannot take them from the panel itself.
 */

export const NOTES_PANEL_ID = "not-yonetimi";

// Amber, distinct from the drawer's own two accents (sand for page blocks,
// lilac for collections) so the rail reads as three areas.
export const NOTES_PANEL_ACCENT = "#E3B778";
