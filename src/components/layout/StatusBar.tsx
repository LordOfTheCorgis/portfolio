"use client";

import { useEffect, useState } from "react";
import { sections, type SectionId } from "@/lib/sections";
import { SITE } from "@/lib/site";
import { serverCount } from "@/lib/data";

/*
  tmux status line as the site nav. Fixed bottom, windows are anchors,
  the active one tracks whichever section is mostly on screen.
*/
export default function StatusBar() {
  const [active, setActive] = useState<SectionId>("hero");
  const [clock, setClock] = useState<string>("");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);

    // rootMargin shrinks the viewport to a band around the middle so the
    // active window flips roughly when a section crosses centre, not on edges
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id as SectionId);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const fmt = () =>
      setClock(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }),
      );
    fmt();
    const id = setInterval(fmt, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-50 h-(--status-bar-h) bg-bg-soft border-t border-rule text-[13px] leading-8 select-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex h-full items-stretch overflow-hidden">
        <span className="shrink-0 bg-amber text-bg font-bold px-3">[{SITE.handle}]</span>

        <ul className="flex items-stretch overflow-x-auto [scrollbar-width:none] px-1">
          {sections.map((s, i) => {
            const isActive = s.id === active;
            return (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={
                    "block px-2.5 transition-colors " +
                    (isActive
                      ? "bg-rule-strong text-fg"
                      : "text-fg-dim hover:text-fg hover:bg-rule")
                  }
                >
                  {i}:{s.label}
                  {isActive ? "*" : ""}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex shrink-0 items-stretch">
          <span className="hidden sm:block px-3 text-fg-dim">
            {serverCount}+ srv <span className="text-muted">·</span> lumix
          </span>
          <span className="bg-rule-strong text-fg px-3 tabular-nums" suppressHydrationWarning>
            {clock || "--:--"}
          </span>
        </div>
      </div>
    </nav>
  );
}
