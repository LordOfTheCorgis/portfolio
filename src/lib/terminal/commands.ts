/*
  Shared command registry. The xterm terminal runs these, and the Cmd+K
  palette will list them later, so keep it dumb: name in, lines out.
  Output is ansi-coloured strings; the palette can strip codes if it needs to.
*/
import { experience, profile, projects, serverCount, stack } from "@/lib/data";
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
  run: (args: string[]) => CommandResult;
};

const line = (label: string, value: string) =>
  `${c("amber", label.padEnd(10))}${value}`;

export const neofetchLines = (): string[] => {
  const user = `${c("green", SITE.handle)}${c("muted", "@")}${c("green", SITE.hostname)}`;
  return [
    user,
    c("muted", "-".repeat(SITE.handle.length + SITE.hostname.length + 1)),
    line("OS", profile.name),
    line("Host", `${profile.schoolShort} (CS + AI, Class of ${profile.classOf})`),
    line("Kernel", profile.degrees.join(" / ")),
    line("Uptime", formatUptime()),
    line("Shell", profile.role),
    line("Packages", `${projects.length} (projects), ${serverCount}+ (servers)`),
    line("CPU", profile.languages.join(", ")),
    line("Location", profile.location),
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
            `  ${c("green", cmd.name.padEnd(10))}${c("muted", (cmd.args ?? "").padEnd(16))}${cmd.description}`,
        ),
        "",
        c("muted", "tab completes, ↑/↓ walks history, ctrl+l clears"),
      ],
    }),
  },
  {
    name: "whoami",
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
        lines: projects.map(
          (p) =>
            `${c("aqua", (p.id + "/").padEnd(18))}${c("muted", `[${p.tags.join(", ")}]`.padEnd(16))}${p.summary}`,
        ),
      };
    },
  },
  {
    name: "cat",
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
            `${c("muted", `[${e.start === e.end ? e.start : `${e.start} → ${e.end}`}]`)} ${b(e.org)} ${c("muted", "·")} ${c("amber", e.role)}`,
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
    description: "system info",
    run: () => ({ lines: neofetchLines() }),
  },
  {
    name: "stack",
    description: "what I actually use",
    run: () => ({
      lines: stack.map((s) => `${c("muted", s.group.padEnd(9))}${s.name}`),
    }),
  },
  {
    name: "contact",
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
