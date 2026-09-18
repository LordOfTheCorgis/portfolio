"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projects, tagBorder, tagColor, type Tag } from "@/lib/data";
import Pane from "@/components/ui/Pane";

const TAGS: Tag[] = ["Infra", "AI", "Web"];

export default function ProjectGrid() {
  const [active, setActive] = useState<Tag | null>(null);
  const reduce = useReducedMotion();
  const shown = active ? projects.filter((p) => p.tags.includes(active)) : projects;

  return (
    <Pane
      id="projects"
      index={5}
      cmd={`ls projects/${active ? ` --tag=${active.toLowerCase()}` : ""}`}
      aside={`${shown.length} of ${projects.length}`}
    >
      <div role="group" aria-label="Filter by tag" className="mb-6 flex flex-wrap gap-2 text-[13px]">
        <button
          type="button"
          onClick={() => setActive(null)}
          aria-pressed={active === null}
          className={`rounded-sm border px-2.5 py-1 transition-colors ${
            active === null ? "border-fg text-fg" : "border-rule text-fg-dim hover:border-fg-dim hover:text-fg"
          }`}
        >
          --all
        </button>
        {TAGS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActive(active === t ? null : t)}
            aria-pressed={active === t}
            className={`rounded-sm border px-2.5 py-1 transition-colors ${
              active === t ? `${tagBorder[t]} ${tagColor[t]}` : "border-rule text-fg-dim hover:border-fg-dim hover:text-fg"
            }`}
          >
            --tag={t.toLowerCase()}
          </button>
        ))}
      </div>

      <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p) => (
            <motion.li
              key={p.id}
              layout
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22 }}
              className="group relative flex flex-col rounded-md border border-rule bg-bg-soft/70 p-5 transition-colors hover:border-rule-strong"
            >
              <div className="flex items-baseline justify-between gap-3 text-[12px]">
                <span className="text-blue">{p.id}/</span>
                <span className="flex gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className={tagColor[t]}>
                      #{t.toLowerCase()}
                    </span>
                  ))}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-bold leading-tight text-fg">{p.name}</h3>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-fg-dim">{p.summary}</p>

              <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-muted">
                {p.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>

              {p.href && (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-fit items-center gap-1.5 text-[13px] text-aqua hover:underline"
                >
                  <span className="text-green">$</span> open {p.href.replace("https://", "")}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {shown.length === 0 && (
        <p className="rounded-md border border-dashed border-rule p-6 text-[13px] text-fg-dim">
          <span className="text-red">ls: </span>
          no projects tagged <span className={tagColor[active!]}>#{active!.toLowerCase()}</span> yet.
          <span className="text-muted"> B.S. Artificial Intelligence in progress, class of 2029. Check back.</span>
        </p>
      )}
    </Pane>
  );
}
