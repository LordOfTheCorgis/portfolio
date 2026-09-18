"use client";

import { motion, useReducedMotion } from "framer-motion";
import { experience, tagColor } from "@/lib/data";
import Pane from "@/components/ui/Pane";

function hash(id: string): string {
  let h = 2166136261;
  for (const ch of id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

const ORDER = ["lumix", "sec-fantasy", "gdg", "cfx"];

export default function GitLog() {
  const reduce = useReducedMotion();
  const items = ORDER.map((id) => experience.find((e) => e.id === id)!);

  return (
    <Pane id="experience" index={4} cmd="git log --graph --decorate" aside={`${items.length} commits`}>
      <motion.ol
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        className="relative"
      >

        <span aria-hidden className="absolute left-[7px] top-3 bottom-3 w-px bg-rule-strong" />

        {items.map((e, i) => {
          const isHead = i === 0;
          const dot = tagColor[e.tags[0]].replace("text-", "bg-");
          return (
            <motion.li
              key={e.id}
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
              className="relative pl-9 pb-10 last:pb-0"
            >

              <span
                aria-hidden
                className={`absolute left-0 top-[7px] h-[15px] w-[15px] rounded-full border-2 border-bg ${dot} ${
                  isHead ? "ring-2 ring-amber ring-offset-2 ring-offset-bg" : ""
                }`}
              />

              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[13px] sm:text-sm">
                <span className="text-amber">{hash(e.id)}</span>
                <span className="text-muted">
                  (<span className={isHead ? "text-aqua" : "text-green"}>{e.ref}</span>)
                </span>
                <span className="ml-auto text-muted tabular-nums">
                  {e.start === e.end ? e.start : `${e.start} → ${e.end}`}
                </span>
              </div>

              <h3 className="mt-2 text-lg font-bold leading-tight text-fg sm:text-xl">
                {e.org}
                <span className="text-muted"> · </span>
                <span className={tagColor[e.tags[0]]}>{e.role}</span>
              </h3>

              <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-fg-dim sm:text-sm">
                {e.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-green">›</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex gap-2 text-[12px]">
                {e.tags.map((t) => (
                  <span key={t} className={`${tagColor[t]}`}>
                    #{t.toLowerCase()}
                  </span>
                ))}
              </div>
            </motion.li>
          );
        })}
      </motion.ol>
    </Pane>
  );
}
