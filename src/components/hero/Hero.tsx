"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";
import KineticName from "./KineticName";
import NodeField from "./NodeField";
import Neofetch from "@/components/neofetch/Neofetch";
import { runInTerminal } from "@/lib/events";
import { SITE } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

// each chip hovers in its own gruvbox colour, same mapping the terminal
// uses for tags so the two feel like one system
const QUICK: { cmd: string; hover: string }[] = [
  { cmd: "whoami", hover: "hover:border-green hover:text-green" },
  { cmd: "cat about.txt", hover: "hover:border-aqua hover:text-aqua" },
  { cmd: "ls projects/", hover: "hover:border-orange hover:text-orange" },
  { cmd: "cat experience.log", hover: "hover:border-purple hover:text-purple" },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // scroll-linked: name drifts up and fades as the terminal takes over.
  // scrub so it's tied to scroll position, not a fire-once tween.
  useLayoutEffect(() => {
    if (reduce || !root.current || !left.current) return;
    const ctx = gsap.context(() => {
      gsap.to(left.current, {
        y: -60,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section
      id="hero"
      ref={root}
      className="relative flex min-h-[calc(100svh-var(--status-bar-h))] w-full flex-col justify-center overflow-hidden"
    >
      <NodeField />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:px-12">
        <div ref={left}>
          <motion.div {...fade(0)} className="mb-5 text-sm text-muted">
            <span className="text-green">{SITE.handle}@{SITE.hostname}</span>
            <span className="text-muted">:</span>
            <span className="text-blue">~</span>
            <span className="text-fg">$ whoami</span>
            <span className="cursor-blink ml-1 inline-block h-[1em] w-[0.55em] translate-y-[2px] bg-amber align-baseline" />
          </motion.div>

          <KineticName />

          <motion.p
            {...fade(1.6)}
            className="mt-7 max-w-xl text-[15px] leading-relaxed text-fg-dim sm:text-base"
          >
            <span className="text-aqua">CS + AI @ LSU</span>
            <span className="text-muted"> · </span>
            <span className="text-orange">Founder, Lumix Solutions</span>
            <span className="text-muted"> · </span>
            <span className="text-purple">Infrastructure &amp; Systems</span>
          </motion.p>

          <motion.ul {...fade(1.8)} className="mt-8 flex flex-wrap gap-2" aria-label="Run a command">
            {QUICK.map(({ cmd, hover }) => (
              <li key={cmd}>
                <button
                  type="button"
                  onClick={() => runInTerminal(cmd)}
                  className={`rounded-sm border border-rule bg-bg-soft/90 px-2.5 py-1 text-[13px] text-fg-dim transition-colors ${hover}`}
                >
                  <span className="text-green">$</span> {cmd}
                </button>
              </li>
            ))}
          </motion.ul>
        </div>

        <Neofetch />
      </div>
    </section>
  );
}
