"use client";

import dynamic from "next/dynamic";

// xterm touches window at import time, so it can never render on the server
const Terminal = dynamic(() => import("./Terminal"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center px-5 text-sm text-muted">
      <span className="text-green">●</span>
      <span className="ml-2">connecting to evan@lsu…</span>
    </div>
  ),
});

/*
  Window chrome around the terminal. Title bar mimics a tmux pane border
  with the pane index so it matches the neofetch panel up in the hero.
*/
export default function TerminalSection() {
  return (
    <section
      id="terminal"
      className="mx-auto w-full max-w-7xl px-5 pb-24 pt-8 sm:px-8 lg:px-12"
      aria-label="Interactive terminal"
    >
      <div className="rounded-md border border-rule bg-bg shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_30px_80px_-30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between border-b border-rule bg-bg-soft px-4 py-2 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="text-fg-dim">pane 2 · bash</span>
            <span className="hidden sm:inline">· evan@lsu:~</span>
          </div>
          <div className="flex gap-3">
            <span>
              <span className="text-green">tab</span> complete
            </span>
            <span>
              <span className="text-green">↑↓</span> history
            </span>
            <span className="hidden sm:inline">
              <span className="text-green">^L</span> clear
            </span>
          </div>
        </div>
        <div className="h-[26rem] sm:h-[30rem]">
          <Terminal />
        </div>
      </div>
    </section>
  );
}
