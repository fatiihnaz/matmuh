"use client";

/**
 * @file The drawer's tab strip, rebuilt for our panel: a horizontally scrolling
 * tablist whose active tab is marked by a sliding underline, with edge chevrons
 * that appear only when there is more strip than room.
 *
 * A port rather than an import, for the same reason `panel-ui.js` exists:
 * inscribed keeps `TabBar` private to `admin/Drawer.jsx`. Behaviour is matched
 * deliberately, roving tabindex included, so a panel's strip and the drawer's
 * own answer the keyboard the same way.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  TABBAR_CHEVRON_CLASS,
  TABBAR_SCROLL_CLASS,
  TAB_CLASS,
  tabBarChevronStyle,
  tabBarScrollStyle,
  tabBarStyle,
  tabButtonActiveStyle,
  tabButtonStyle,
  tabCountActiveStyle,
  tabCountStyle,
} from "./panel-ui";

const EASE = "cubic-bezier(0.32, 0.72, 0.18, 1)";

/**
 * @param {{
 *   tabs: { id: string, label: string, count?: number | null }[],
 *   activeTab: string,
 *   onChange: (id: string) => void,
 *   accent: string,
 * }} props
 */
export default function PanelTabBar({ tabs, activeTab, onChange, accent }) {
  const scrollRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const [overflow, setOverflow] = useState({ left: false, right: false });
  const [indicator, setIndicator] = useState(/** @type {{left: number, width: number}|null} */ (null));

  const measure = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setOverflow({
      left: el.scrollLeft > 0,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [tabs, measure]);

  // Layout effect: the underline is measured off the DOM, so it has to be
  // placed before paint or the first frame shows it at the previous tab.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const button = el.querySelector(`[data-tab-id="${CSS.escape(activeTab)}"]`);
    if (button instanceof HTMLElement) {
      button.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
      setIndicator({ left: button.offsetLeft, width: button.offsetWidth });
    }
    requestAnimationFrame(measure);
  }, [activeTab, tabs, measure]);

  const nudge = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: "smooth" });
  };

  /** @param {React.KeyboardEvent} event */
  const onKeyDown = (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    const jump = { Home: 0, End: tabs.length - 1 }[event.key];
    const at = tabs.findIndex((tab) => tab.id === activeTab);
    let next = -1;
    if (step != null && at !== -1) next = (at + step + tabs.length) % tabs.length;
    else if (jump != null) next = jump;
    if (next === -1 || !tabs[next]) return;
    event.preventDefault();
    onChange(tabs[next].id);
    // Selection follows focus, so the newly current tab has to take it too.
    scrollRef.current?.querySelector(`[data-tab-id="${CSS.escape(tabs[next].id)}"]`)?.focus();
  };

  return (
    <div style={tabBarStyle}>
      {overflow.left && (
        <button
          type="button"
          onClick={() => nudge(-1)}
          className={TABBAR_CHEVRON_CLASS}
          style={tabBarChevronStyle}
          aria-label="Önceki sekmeler"
        >
          <ChevronLeft size={14} />
        </button>
      )}

      <div
        ref={scrollRef}
        role="tablist"
        className={TABBAR_SCROLL_CLASS}
        style={tabBarScrollStyle}
        onScroll={measure}
        onKeyDown={onKeyDown}
      >
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              data-tab-id={tab.id}
              aria-selected={active}
              // Roving: the strip is one tab stop and the arrows move inside it.
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(tab.id)}
              className={TAB_CLASS}
              style={active ? { ...tabButtonStyle, ...tabButtonActiveStyle } : tabButtonStyle}
            >
              <span>{tab.label}</span>
              {tab.count != null && (
                <span style={active ? { ...tabCountStyle, ...tabCountActiveStyle } : tabCountStyle}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}

        {indicator && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: -1,
              left: indicator.left,
              width: indicator.width,
              height: 2,
              background: accent,
              borderRadius: 1,
              transition: `left 200ms ${EASE}, width 200ms ${EASE}`,
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {overflow.right && (
        <button
          type="button"
          onClick={() => nudge(1)}
          className={TABBAR_CHEVRON_CLASS}
          style={tabBarChevronStyle}
          aria-label="Sonraki sekmeler"
        >
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
