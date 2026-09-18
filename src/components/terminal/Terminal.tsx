"use client";

import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bannerLines, completeCommand, runCommand } from "@/lib/terminal/commands";
import { ansi, c } from "@/lib/terminal/ansi";
import { TERM_RUN } from "@/lib/events";
import { SITE } from "@/lib/site";
import { scrollToEl } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

const PROMPT = `${c("green", `${SITE.handle}@${SITE.hostname}`)}${c("muted", ":")}${c("blue", "~")}${c("fg", "$ ")}`;

const THEME = {
  background: "#1d2021",
  foreground: "#ebdbb2",
  cursor: "#fabd2f",
  cursorAccent: "#1d2021",
  selectionBackground: "rgba(250,189,47,0.35)",
  black: "#282828",
  red: "#cc241d",
  green: "#98971a",
  yellow: "#d79921",
  blue: "#458588",
  magenta: "#b16286",
  cyan: "#689d6a",
  white: "#a89984",
  brightBlack: "#928374",
  brightRed: "#fb4934",
  brightGreen: "#b8bb26",
  brightYellow: "#fabd2f",
  brightBlue: "#83a598",
  brightMagenta: "#d3869b",
  brightCyan: "#8ec07c",
  brightWhite: "#ebdbb2",
};

const ESC = String.fromCharCode(27);
const KEY = {
  enter: "\r",
  backspace: String.fromCharCode(127),
  ctrlC: String.fromCharCode(3),
  ctrlL: String.fromCharCode(12),
  tab: "\t",
  up: `${ESC}[A`,
  down: `${ESC}[B`,
  right: `${ESC}[C`,
  left: `${ESC}[D`,
};

const CLEAR_SCREEN = `${ESC}[2J${ESC}[H`;

export default function Terminal() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const fontVar = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-jetbrains")
      .trim();

    const term = new XTerm({
      cursorBlink: true,
      cursorStyle: "block",
      fontFamily: `${fontVar || "JetBrains Mono"}, ui-monospace, monospace`,
      fontSize: window.innerWidth < 640 ? 12 : 13.5,
      lineHeight: 1.35,
      theme: THEME,
      scrollback: 1000,
      convertEol: true,
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.loadAddon(new WebLinksAddon((_e, uri) => window.open(uri, "_blank", "noopener")));

    let buffer = "";
    const history: string[] = [];
    let histIdx = -1;
    let busy = false;

    const prompt = () => term.write(`\r\n${PROMPT}`);

    const execute = (input: string) => {
      const trimmed = input.trim();
      if (trimmed) {
        history.push(trimmed);
        histIdx = history.length;
      }
      const result = runCommand(trimmed);
      if (result.action === "clear") {
        term.clear();
        term.write(`${CLEAR_SCREEN}${PROMPT}`);
        return;
      }
      if (result.lines.length) term.write("\r\n" + result.lines.join("\r\n"));
      if (result.action && typeof result.action === "object" && "open" in result.action) {
        window.open(result.action.open, "_blank", "noopener");
      }
      prompt();
    };

    const clearLine = () => {

      term.write("\b".repeat(buffer.length) + " ".repeat(buffer.length) + "\b".repeat(buffer.length));
    };

    const setBuffer = (next: string) => {
      clearLine();
      buffer = next;
      term.write(buffer);
    };

    const pending: string[] = [];

    const handle = (data: string) => {
      switch (data) {
        case KEY.enter:
          execute(buffer);
          buffer = "";
          return;
        case KEY.backspace:
          if (buffer.length) {
            buffer = buffer.slice(0, -1);
            term.write("\b \b");
          }
          return;
        case KEY.ctrlC:
          term.write("^C");
          buffer = "";
          prompt();
          return;
        case KEY.ctrlL:
          term.write(`${CLEAR_SCREEN}${PROMPT}${buffer}`);
          return;
        case KEY.tab: {
          const matches = completeCommand(buffer);
          if (matches.length === 1) {
            const [head, ...rest] = buffer.split(/\s+/);
            const next = rest.length ? `${head} ${matches[0]}` : `${matches[0]} `;
            setBuffer(next);
          } else if (matches.length > 1) {
            term.write(`\r\n${matches.join("  ")}`);
            term.write(`\r\n${PROMPT}${buffer}`);
          }
          return;
        }
        case KEY.up:
          if (history.length && histIdx > 0) {
            histIdx -= 1;
            setBuffer(history[histIdx]);
          }
          return;
        case KEY.down:
          if (histIdx < history.length - 1) {
            histIdx += 1;
            setBuffer(history[histIdx]);
          } else {
            histIdx = history.length;
            setBuffer("");
          }
          return;
        case KEY.left:
        case KEY.right:
          return;
      }

      const printable = data.replace(/[^\x20-\x7e]/g, "");
      if (printable) {
        buffer += printable;
        term.write(printable);
      }
    };

    term.onData((data) => {
      if (busy) pending.push(data);
      else handle(data);
    });

    const queue: string[] = [];
    const drain = async () => {
      if (busy) return;
      busy = true;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wait = (ms: number) => (reduce ? Promise.resolve() : new Promise((r) => setTimeout(r, ms)));
      while (queue.length) {
        const cmd = queue.shift()!;
        if (buffer) {
          clearLine();
          buffer = "";
        }
        for (const ch of cmd) {
          buffer += ch;
          term.write(ch);
          await wait(28 + Math.random() * 40);
        }
        await wait(160);
        execute(buffer);
        buffer = "";
        await wait(250);
      }
      busy = false;
      while (pending.length) handle(pending.shift()!);
    };
    const typeAndRun = (cmd: string) => {
      queue.push(cmd);
      void drain();
    };

    const onExternal = (e: Event) => {
      const cmd = (e as CustomEvent<string>).detail;
      const section = el.closest("section");
      if (section) scrollToEl(section, -24);

      setTimeout(() => {
        term.focus();
        typeAndRun(cmd);
      }, 350);
    };
    window.addEventListener(TERM_RUN, onExternal);

    let ro: ResizeObserver | undefined;
    let st: ScrollTrigger | undefined;
    let disposed = false;
    document.fonts.ready.then(() => {
      if (disposed) return;
      term.open(el);
      fit.fit();
      term.write(
        [
          ...bannerLines(),
          "",
          c("muted", `Last login: ${new Date().toDateString()} on ttys000`),
          `${ansi.dim}welcome to ${SITE.handle}@${SITE.hostname}. type ${ansi.reset}${c("green", "help")}${ansi.dim} to see what's here.${ansi.reset}`,
        ].join("\r\n"),
      );
      prompt();

      ro = new ResizeObserver(() => fit.fit());
      ro.observe(el);

      st = ScrollTrigger.create({
        trigger: el,
        start: "top 70%",
        once: true,
        onEnter: () => typeAndRun("help"),
      });
    });

    return () => {
      disposed = true;
      window.removeEventListener(TERM_RUN, onExternal);
      ro?.disconnect();
      st?.kill();
      term.dispose();
    };
  }, []);

  return <div ref={host} className="h-full w-full" />;
}
