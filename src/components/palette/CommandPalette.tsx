"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Command } from "cmdk";
import { sections } from "@/lib/sections";
import { commandNames } from "@/lib/terminal/commands";
import { runInTerminal } from "@/lib/events";
import { scrollToEl } from "@/lib/scroll";
import { SITE } from "@/lib/site";
import { projects, tagColor } from "@/lib/data";

type Item = {
  id: string;
  group: "go" | "run" | "open" | "projects";
  label: string;
  hint?: string;
  keywords?: string[];
  action: () => void;
};

const GROUP_LABEL: Record<Item["group"], string> = {
  go: "go to",
  run: "run in terminal",
  projects: "projects",
  open: "open",
};
const GROUP_COLOR: Record<Item["group"], string> = {
  go: "text-aqua",
  run: "text-green",
  projects: "text-blue",
  open: "text-purple",
};

const RUNNABLE: Record<string, string> = {
  ls: "ls projects/",
  cat: "cat about.txt",
  open: "open github",
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const go = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) scrollToEl(el, -8);
  }, []);

  const items = useMemo<Item[]>(() => {
    const list: Item[] = [];
    sections.forEach((s, i) => {
      list.push({ id: `go-${s.id}`, group: "go", label: `${i}:${s.label}`, hint: `#${s.id}`, keywords: [s.id, s.label], action: () => go(s.id) });
    });
    commandNames
      .filter((n) => n !== "clear" && n !== "help")
      .forEach((n) => {
        const cmd = RUNNABLE[n] ?? n;
        list.push({ id: `run-${n}`, group: "run", label: cmd, action: () => runInTerminal(cmd) });
      });
    projects.forEach((p) => {
      list.push({
        id: `proj-${p.id}`,
        group: "projects",
        label: p.name,
        hint: p.tags.map((t) => `#${t.toLowerCase()}`).join(" "),
        keywords: [...p.tags, ...p.stack],
        action: () => go("projects"),
      });
    });
    list.push({ id: "open-gh", group: "open", label: "github", hint: SITE.github.replace("https://", ""), action: () => window.open(SITE.github, "_blank", "noopener") });
    list.push({ id: "open-li", group: "open", label: "linkedin", hint: SITE.linkedin.replace("https://www.", ""), action: () => window.open(SITE.linkedin, "_blank", "noopener") });
    list.push({ id: "open-mail", group: "open", label: "copy email", hint: SITE.email, action: () => void navigator.clipboard?.writeText(SITE.email) });
    return list;
  }, [go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    const onOpen = () => setOpen(true);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, []);

  const select = (item: Item) => {
    setOpen(false);
    setQuery("");

    setTimeout(item.action, 60);
  };

  const groups = (["go", "run", "projects", "open"] as const).map((g) => ({ g, items: items.filter((i) => i.group === g) }));

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQuery("");
      }}
      label="Command palette"
      loop
      overlayClassName="fixed inset-0 z-[70] bg-bg/70 backdrop-blur-[2px]"
      contentClassName="fixed left-1/2 top-[14vh] z-[80] w-[min(92vw,38rem)] -translate-x-1/2 overflow-hidden rounded-md border border-rule-strong bg-bg-soft shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
      onKeyDown={(e) => {

        if (e.ctrlKey && e.key === "j") {
          e.preventDefault();
          e.currentTarget.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        }
        if (e.ctrlKey && e.key === "k") {
          e.preventDefault();
          e.currentTarget.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
        }
      }}
    >
      <div className="flex items-center gap-2 border-b border-rule px-3 text-sm">
        <span className="text-amber">&gt;</span>
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="type to fuzzy find"
          className="h-11 flex-1 bg-transparent text-fg placeholder:text-muted focus:outline-none"
        />
        <span className="text-[12px] text-muted tabular-nums">
          {count}/{items.length}
        </span>
      </div>

      <Command.List className="max-h-[50vh] overflow-y-auto p-1.5 text-sm [scrollbar-width:thin]">
        <Command.Empty className="px-3 py-6 text-muted">
          <span className="text-red">✗</span> no match for <span className="text-fg">{query}</span>
        </Command.Empty>
        {groups.map(({ g, items: gi }) => (
          <Command.Group
            key={g}
            heading={GROUP_LABEL[g]}
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted"
          >
            {gi.map((item) => (
              <Command.Item
                key={item.id}
                value={`${item.label} ${item.keywords?.join(" ") ?? ""}`}
                onSelect={() => select(item)}
                className="group flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-fg-dim data-[selected=true]:bg-rule data-[selected=true]:text-fg"
              >
                <span className="w-3 text-amber opacity-0 group-data-[selected=true]:opacity-100">&gt;</span>
                <span className={`w-[7.5rem] shrink-0 text-[11px] uppercase tracking-wider ${GROUP_COLOR[item.group]}`}>
                  {GROUP_LABEL[item.group]}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.hint && (
                  <span className={`truncate text-[12px] ${item.group === "projects" ? tagColor.Web : "text-muted"}`}>
                    {item.hint}
                  </span>
                )}
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>

      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-rule px-3 py-2 text-[11px] text-muted">
        <span>
          <span className="text-fg-dim">↑↓</span> / <span className="text-fg-dim">^j ^k</span> move
        </span>
        <span>
          <span className="text-fg-dim">↵</span> select
        </span>
        <span>
          <span className="text-fg-dim">esc</span> close
        </span>
      </div>

      <MatchCounter onCount={setCount} />
    </Command.Dialog>
  );
}

function MatchCounter({ onCount }: { onCount: (n: number) => void }) {
  useEffect(() => {
    const list = document.querySelector("[cmdk-list]");
    if (!list) return;
    const count = () => onCount(list.querySelectorAll("[cmdk-item]").length);
    count();
    const mo = new MutationObserver(count);
    mo.observe(list, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [onCount]);
  return null;
}

export const openPalette = () => window.dispatchEvent(new Event("palette:open"));
