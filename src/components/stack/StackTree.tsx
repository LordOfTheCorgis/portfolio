"use client";

import { motion, useReducedMotion } from "framer-motion";
import { stack, stackGroupColor, type StackGroup } from "@/lib/data";
import Pane from "@/components/ui/Pane";

/*
  `tree stack/`. Groups are directories, tools are files, the note is what
  tree would never print but a README would. Real box-drawing glyphs so it
  copies out of the page as valid tree output.
*/
const ORDER: StackGroup[] = ["infra", "runtime", "lang", "web", "data"];

export default function StackTree() {
  const reduce = useReducedMotion();
  const groups = ORDER.map((g) => ({ g, items: stack.filter((s) => s.group === g) }));

  // flatten to rows first so the stagger runs top to bottom, not per group
  const rows: React.ReactNode[] = [];
  rows.push(
    <span key="root" className="text-fg font-bold">
      stack/
    </span>,
  );
  groups.forEach(({ g, items }, gi) => {
    const lastGroup = gi === groups.length - 1;
    rows.push(
      <span key={g}>
        <span className="text-rule-strong">{lastGroup ? "└── " : "├── "}</span>
        <span className={`font-bold ${stackGroupColor[g]}`}>{g}/</span>
      </span>,
    );
    items.forEach((it, ii) => {
      const lastItem = ii === items.length - 1;
      rows.push(
        <span key={it.slug} className="flex flex-col sm:flex-row sm:items-baseline">
          <span className="shrink-0">
            <span className="text-rule-strong">{lastGroup ? "    " : "│   "}</span>
            <span className="text-rule-strong">{lastItem ? "└── " : "├── "}</span>
            <span className="text-fg">{it.slug}</span>
          </span>
          <span className="pl-16 text-fg-dim sm:pl-0 sm:before:content-['__'] sm:before:text-transparent">
            <span className="text-muted"># </span>
            {it.note}
          </span>
        </span>,
      );
    });
  });

  return (
    <Pane id="stack" index={3} cmd="tree stack/" aside={`${groups.length} directories, ${stack.length} files`}>
      <motion.pre
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        className="whitespace-pre-wrap text-[13px] leading-7 sm:text-sm"
      >
        {rows.map((r, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0, transition: { duration: 0.2 } } }}
          >
            {r}
          </motion.div>
        ))}
      </motion.pre>

      <p className="mt-8 max-w-2xl text-[13px] leading-relaxed text-fg-dim sm:text-sm">
        <span className="text-muted"># </span>
        The infra half is what pays for the servers. The data and web half is what runs on
        them. Lua is the one that started all of it.
      </p>
    </Pane>
  );
}
