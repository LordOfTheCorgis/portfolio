"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { profile, projects, serverCount } from "@/lib/data";
import { SITE } from "@/lib/site";
import { formatUptime } from "@/lib/terminal/uptime";
import RackLogo from "./RackLogo";

const SWATCHES = [
  "bg-amber",
  "bg-green",
  "bg-aqua",
  "bg-orange",
  "bg-red",
  "bg-blue",
  "bg-purple",
  "bg-muted",
];

/*
  Panel version of `neofetch`, sits next to the hero name. Same facts as the
  terminal command so the two never disagree. Uptime re-renders every minute.
*/
export default function Neofetch() {
  const reduce = useReducedMotion();
  // empty on the server, filled on mount. avoids the hydration mismatch
  // you'd get from Date() differing between server and client.
  const [uptime, setUptime] = useState("");

  useEffect(() => {
    const tick = () => setUptime(formatUptime());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const rows: [string, string][] = [
    ["OS", profile.name],
    ["Host", `${profile.schoolShort} (CS + AI, Class of ${profile.classOf})`],
    ["Uptime", uptime || "booting…"],
    ["Shell", profile.role],
    ["Packages", `${projects.length} (projects), ${serverCount}+ (servers)`],
    ["CPU", profile.languages.join(", ")],
  ];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-md border border-rule bg-bg-soft/80 p-4 sm:p-5 text-[13px] sm:text-sm"
    >
      {/* fake pane title like tmux's pane border status */}
      <div className="absolute -top-2.5 left-4 bg-bg px-1.5 text-[11px] text-muted">
        pane 1 · neofetch
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        <RackLogo />

        <div className="min-w-0">
          <div className="mb-1">
            <span className="text-green font-bold">{SITE.handle}</span>
            <span className="text-muted">@</span>
            <span className="text-green font-bold">{SITE.hostname}</span>
          </div>
          <div className="text-rule-strong mb-2">{"─".repeat(SITE.handle.length + SITE.hostname.length + 1)}</div>

          <dl>
            {rows.map(([k, v], i) => (
              <motion.div
                key={k}
                initial={reduce ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.1 + i * 0.07 }}
                className="flex gap-2 leading-6"
              >
                <dt className="w-[5.5rem] shrink-0 text-amber font-bold">{k}</dt>
                <dd className="min-w-0 text-fg break-words" suppressHydrationWarning>
                  {v}
                </dd>
              </motion.div>
            ))}
          </dl>

          <div className="mt-3 flex">
            {SWATCHES.map((cls) => (
              <span key={cls} className={`h-3.5 w-6 ${cls}`} aria-hidden />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
