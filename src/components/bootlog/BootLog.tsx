"use client";

import { motion, useReducedMotion } from "framer-motion";

/*
  dmesg between the hero and the terminal. Every line is a real fact from
  the resume, dressed as a kernel message. Prints once when scrolled into
  view. The WARN line is the only joke on the site, leave it.
*/
type Line = {
  t: string;
  status: "OK" | "WARN" | "INFO";
  src: string;
  msg: string;
};

const LINES: Line[] = [
  { t: "0.000000", status: "OK", src: "evan", msg: "booting portfolio (next 16, node 22, tailwind 4)" },
  { t: "0.000412", status: "OK", src: "lsu", msg: "enrolled: b.s. computer science (swe) + b.s. artificial intelligence, eta may 2029" },
  { t: "0.001337", status: "OK", src: "lumix", msg: "proxmox cluster online, 50+ nodes across the us, game + web workloads" },
  { t: "0.002048", status: "OK", src: "lumix", msg: "ddos mitigation armed, vps provisioning automated" },
  { t: "0.004096", status: "OK", src: "cfx", msg: "7y in service, 5,000+ active users, node.js hot paths -67% latency" },
  { t: "0.008192", status: "OK", src: "sec-fantasy", msg: "react native + firestore rules + realtime apis, summer 2026" },
  { t: "0.016384", status: "OK", src: "gdg-lsu", msg: "outreach loaded, geaux hack scheduled" },
  { t: "0.032768", status: "WARN", src: "evan", msg: "sleep_schedule not found, continuing anyway" },
  { t: "0.065536", status: "INFO", src: "init", msg: "reached target: interactive terminal" },
];

const STATUS: Record<Line["status"], { cls: string; label: string }> = {
  OK: { cls: "text-green", label: "  OK  " },
  WARN: { cls: "text-amber", label: " WARN " },
  INFO: { cls: "text-blue", label: " INFO " },
};

const SRC: Record<string, string> = {
  evan: "text-fg",
  lsu: "text-purple",
  lumix: "text-orange",
  cfx: "text-aqua",
  "sec-fantasy": "text-blue",
  "gdg-lsu": "text-purple",
  init: "text-muted",
};

export default function BootLog() {
  const reduce = useReducedMotion();
  return (
    <section
      aria-label="Boot log"
      className="mx-auto w-full max-w-7xl px-5 pb-4 pt-0 sm:px-8 lg:px-12"
    >
      <motion.ol
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.11 } } }}
        className="overflow-x-auto text-[12.5px] leading-6 sm:text-[13px]"
      >
        {LINES.map((l) => (
          <motion.li
            key={l.t}
            variants={{ hidden: { opacity: 0, x: -4 }, show: { opacity: 1, x: 0, transition: { duration: 0.18 } } }}
            className="whitespace-nowrap"
          >
            <span className="text-muted">[</span>
            <span className={STATUS[l.status].cls}>{STATUS[l.status].label}</span>
            <span className="text-muted">] [</span>
            <span className="tabular-nums text-fg-dim">{l.t.padStart(9)}</span>
            <span className="text-muted">] </span>
            <span className={SRC[l.src] ?? "text-fg"}>{l.src}</span>
            <span className="text-muted">: </span>
            <span className="text-fg-dim">{l.msg}</span>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
