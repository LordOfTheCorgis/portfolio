/*
  Shared command registry. The xterm terminal runs these, and the Cmd+K
  palette will list them later, so keep it dumb: name in, lines out.
  Output is ansi-coloured strings; the palette can strip codes if it needs to.
*/
import { experience, profile, projects, serverCount, stack, type Tag } from "@/lib/data";
import { SITE } from "@/lib/site";
import { ansi, b, c } from "./ansi";
import { formatUptime } from "./uptime";

export type CommandResult = {
  lines: string[];
  // side effects the terminal itself has to handle
  action?: "clear" | { open: string };
};

export type Command = {
  name: string;
  args?: string; // shown in help, e.g. "projects/"
  description: string;
  color?: keyof typeof ansi; // how it shows in `help`
  run: (args: string[]) => CommandResult;
};

// tag -> colour, same mapping the react side uses so a project reads the
// same in the terminal as it does in the card grid
const TAG_COLOR: Record<Tag, keyof typeof ansi> = {
  Infra: "orange",
  AI: "purple",
  Web: "aqua",
};
const tags = (list: readonly Tag[]) => list.map((t) => c(TAG_COLOR[t], t)).join(c("muted", ","));

// figlet Standard, coloured top to bottom on the warm ramp. String.raw so
// the backslashes survive. 50 cols, fits a phone at 12px.
const BANNER = [
  String.raw`                                     _          _ `,
  String.raw`   _____   ____ _ _ __   __   _____ (_)___  ___| |`,
  String.raw`  / _ \ \ / / _` + "`" + String.raw` | '_ \  \ \ / / _ \| / __|/ _ \ |`,
  String.raw` |  __/\ V / (_| | | | |  \ V / (_) | \__ \  __/ |`,
  String.raw`  \___| \_/ \__,_|_| |_|   \_/ \___/|_|___/\___|_|`,
];
const RAMP: (keyof typeof ansi)[] = ["amber", "amber", "orange", "orange", "red"];
export const bannerLines = (): string[] => BANNER.map((l, i) => c(RAMP[i], l));

export const neofetchLines = (): string[] => {
  const user = `${c("green", SITE.handle)}${c("muted", "@")}${c("green", SITE.hostname)}`;
  return [
    user,
    c("muted", "-".repeat(SITE.handle.length + SITE.hostname.length + 1)),
    `${c("amber", "OS".padEnd(10))}${profile.name}`,
    `${c("orange", "Host".padEnd(10))}${profile.schoolShort} (CS + AI, Class of ${profile.classOf})`,
    `${c("red", "Kernel".padEnd(10))}${profile.degrees.join(" / ")}`,
    `${c("green", "Uptime".padEnd(10))}${formatUptime()}`,
    `${c("aqua", "Shell".padEnd(10))}${profile.role}`,
    `${c("blue", "Packages".padEnd(10))}${projects.length} (projects), ${serverCount}+ (servers)`,
    `${c("purple", "CPU".padEnd(10))}${profile.languages.join(", ")}`,
    `${c("muted", "Location".padEnd(10))}${profile.location}`,
    "",
    // colour swatch row like the real thing
    ["amber", "green", "aqua", "orange", "red", "blue", "purple", "muted"]
      .map((k) => `${ansi[k as keyof typeof ansi]}███${ansi.reset}`)
      .join(""),
  ];
};

const commands: Command[] = [
  {
    name: "help",
    description: "list available commands",
    run: () => ({
      lines: [
        b("available commands"),
        ...commands.map(
          (cmd) =>
            `  ${c(cmd.color ?? "green", cmd.name.padEnd(10))}${c("muted", (cmd.args ?? "").padEnd(16))}${cmd.description}`,
        ),
        "",
        c("muted", "tab completes, ↑/↓ walks history, ctrl+l clears"),
      ],
    }),
  },
  {
    name: "whoami",
    color: "green",
    description: "name, degree, role",
    run: () => ({
      lines: [
        b(profile.name),
        `${c("muted", "degree  ")}${profile.degrees[0]}`,
        `${c("muted", "        ")}${profile.degrees[1]}`,
        `${c("muted", "school  ")}${profile.school}, ${profile.year}, ${profile.graduation}`,
        `${c("muted", "role    ")}${profile.role}`,
        `${c("muted", "also    ")}CFX developer since 2018, 5,000+ active users`,
      ],
    }),
  },
  {
    name: "ls",
    color: "aqua",
    args: "projects/",
    description: "list projects",
    run: (args) => {
      const target = (args[0] ?? "projects/").replace(/\/$/, "");
      if (target !== "projects" && target !== "." && target !== "") {
        return { lines: [c("red", `ls: cannot access '${args[0]}': No such file or directory`)] };
      }
      if (target === "." || target === "") {
        return { lines: [`${c("blue", "projects/")}  about.txt  experience.log`] };
      }
      return {
        // name + tags on one line, summary wrapped underneath. one long line
        // per project wrapped mid-word at the cell edge and looked terrible
        lines: projects.flatMap((p) => [
          `${c("blue", (p.id + "/").padEnd(18))}${c("muted", "[")}${tags(p.tags)}${c("muted", "]")}${p.href ? `  ${c("muted", "→")} ${c("aqua", p.href)}` : ""}`,
          ...wrap(p.summary, 76).map((l) => `    ${c("fg-dim", l)}`),
          "",
        ]),
      };
    },
  },
  {
    name: "cat",
    color: "aqua",
    args: "<file>",
    description: "about.txt or experience.log",
    run: (args) => {
      const file = args[0];
      if (!file) return { lines: [c("red", "cat: missing file operand")] };
      if (file === "about.txt") {
        return { lines: profile.about.flatMap((p) => [wrap(p, 88), ""]).flat() };
      }
      if (file === "experience.log") {
        return {
          lines: experience.flatMap((e) => [
            `${c("muted", `[${e.start === e.end ? e.start : `${e.start} → ${e.end}`}]`)} ${c(TAG_COLOR[e.tags[0]], e.org)} ${c("muted", "·")} ${c("amber", e.role)} ${c("muted", "[")}${tags(e.tags)}${c("muted", "]")}`,
            ...e.bullets.map((bl) => `  ${c("green", "›")} ${bl}`),
            "",
          ]),
        };
      }
      return { lines: [c("red", `cat: ${file}: No such file or directory`)] };
    },
  },
  {
    name: "neofetch",
    color: "amber",
    description: "system info",
    run: () => ({ lines: neofetchLines() }),
  },
  {
    name: "stack",
    color: "orange",
    description: "what I actually use",
    run: () => ({
      lines: stack.map((s) => {
        const col: Record<string, keyof typeof ansi> = { infra: "orange", runtime: "green", lang: "amber", web: "aqua", data: "blue" };
        return `${c(col[s.group] ?? "muted", s.group.padEnd(9))}${s.name}`;
      }),
    }),
  },
  {
    name: "contact",
    color: "purple",
    description: "where to find me",
    run: () => ({
      lines: [
        `${c("muted", "github    ")}${c("aqua", SITE.github)}`,
        `${c("muted", "linkedin  ")}${c("aqua", SITE.linkedin)}`,
        "",
        c("muted", "links are clickable, or run: open github | open linkedin"),
      ],
    }),
  },
  {
    name: "open",
    color: "purple",
    args: "github|linkedin",
    description: "open a link in a new tab",
    run: (args) => {
      const target = args[0];
      if (target === "github") return { lines: [c("muted", `opening ${SITE.github}`)], action: { open: SITE.github } };
      if (target === "linkedin") return { lines: [c("muted", `opening ${SITE.linkedin}`)], action: { open: SITE.linkedin } };
      return { lines: [c("red", `open: unknown target '${target ?? ""}'. try github or linkedin`)] };
    },
  },
  {
    name: "clear",
    color: "muted",
    description: "clear the screen",
    run: () => ({ lines: [], action: "clear" }),
  },
];

/* word wrap so about.txt doesn't run off the right edge on wide terms */
function wrap(text: string, width: number): string[] {
  const words = text.split(" ");
  const out: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > width) {
      out.push(cur.trim());
      cur = w;
    } else {
      cur += " " + w;
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

export const commandNames = commands.map((cmd) => cmd.name);

export function runCommand(input: string): CommandResult {
  const [name, ...args] = input.trim().split(/\s+/);
  if (!name) return { lines: [] };
  // "ls projects/" and "cat about.txt" both work, so does "neofetch"
  const cmd = commands.find((cmd) => cmd.name === name);
  if (!cmd) {
    return {
      lines: [
        c("red", `${name}: command not found`),
        c("muted", "try `help`"),
      ],
    };
  }
  return cmd.run(args);
}

export function completeCommand(partial: string): string[] {
  const [head, ...rest] = partial.split(/\s+/);
  if (rest.length === 0) return commandNames.filter((n) => n.startsWith(head));
  // file-ish completion for the two commands that take one
  if (head === "cat") return ["about.txt", "experience.log"].filter((f) => f.startsWith(rest[0] ?? ""));
  if (head === "ls") return ["projects/"].filter((f) => f.startsWith(rest[0] ?? ""));
  if (head === "open") return ["github", "linkedin"].filter((f) => f.startsWith(rest[0] ?? ""));
  return [];
}
