"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

const CHARS = "01<>/\\|_-=+#$%&*[]{}";

export default function KineticName() {
  const first = useRef<HTMLSpanElement>(null);
  const last = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !first.current || !last.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.fromTo(
        first.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.05 },
      )
        .to(first.current, {
          duration: 0.9,
          scrambleText: { text: "Evan", chars: CHARS, speed: 0.5, revealDelay: 0.15 },
        })
        .fromTo(last.current, { opacity: 0 }, { opacity: 1, duration: 0.05 }, "-=0.45")
        .to(
          last.current,
          {
            duration: 1.0,
            scrambleText: { text: "Voisel", chars: CHARS, speed: 0.5, revealDelay: 0.15 },
          },
          "<",
        );
    });
    return () => ctx.revert();
  }, []);

  return (
    <h1 className="font-extrabold uppercase tracking-[-0.04em] leading-[0.86] text-[clamp(3.5rem,13vw,10rem)]">
      <span ref={first} className="block text-fg">
        Evan
      </span>
      <span ref={last} className="text-ember block pb-[0.08em]">
        Voisel
      </span>
    </h1>
  );
}
