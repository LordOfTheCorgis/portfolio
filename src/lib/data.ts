/*
  All real content on the site. If a section shows a fact, it comes from
  here. No lorem, no "coming soon".
*/

export type Tag = "Infra" | "AI" | "Web";

export const profile = {
  name: "Evan Voisel",
  school: "Louisiana State University",
  schoolShort: "LSU",
  classOf: 2029,
  graduation: "Expected May 2029",
  year: "Sophomore",
  degrees: [
    "B.S. Computer Science (Software Engineering concentration)",
    "B.S. Artificial Intelligence",
  ],
  role: "Founder & CEO, Lumix Solutions",
  location: "Baton Rouge, LA",
  languages: ["TypeScript", "JavaScript", "Lua", "Bash"],
  about: [
    "I run production infrastructure. Lumix Solutions is a Proxmox-based hosting platform I founded and operate: 50+ Linux servers across the US serving game and web workloads, with automated VPS provisioning and DDoS mitigation I built and maintain myself.",
    "Before that, and still now, I've spent 7+ years building scripts and frameworks for CFX (FiveM), shipping to 5,000+ active users and learning the hard way what latency, uptime, and backwards compatibility actually cost.",
    "At LSU I'm a sophomore double-majoring in Computer Science (Software Engineering) and Artificial Intelligence, graduating May 2029. I care about systems that stay up, tooling that gets out of the way, and writing code other people can operate at 3am.",
  ],
} as const;

export type StackGroup = "infra" | "runtime" | "lang" | "web" | "data";

export type StackItem = {
  name: string;
  slug: string; // what shows in the tree listing
  group: StackGroup;
  note: string; // one line on where it actually gets used
};

// group -> colour lives in one place so the tree, the terminal and the
// palette all agree
export const stackGroupColor: Record<StackGroup, string> = {
  infra: "text-orange",
  runtime: "text-green",
  lang: "text-amber",
  web: "text-aqua",
  data: "text-blue",
};

export const stack: StackItem[] = [
  { name: "Proxmox VE", slug: "proxmox-ve", group: "infra", note: "the Lumix cluster. 50+ nodes, VM and LXC templates, provisioning hooks" },
  { name: "Linux system administration", slug: "linux-sysadmin", group: "infra", note: "Debian hosts, networking, DDoS mitigation, the 3am pages" },
  { name: "Node.js", slug: "node", group: "runtime", note: "CFX backends and Lumix tooling. where the 67% latency cut happened" },
  { name: "Bun", slug: "bun", group: "runtime", note: "scripts and services where startup time and TS-without-a-build matter" },
  { name: "TypeScript / JavaScript", slug: "typescript", group: "lang", note: "everything web-side, seven years of it" },
  { name: "Lua", slug: "lua", group: "lang", note: "CFX scripts and frameworks in front of 5,000+ players" },
  { name: "React Native", slug: "react-native", group: "web", note: "SEC Fantasy mobile app, end to end features" },
  { name: "Firebase / Firestore", slug: "firestore", group: "data", note: "SEC Fantasy schema, security rules, realtime listeners" },
  { name: "Supabase", slug: "supabase", group: "data", note: "Postgres, auth and storage for web projects" },
  { name: "Drizzle ORM", slug: "drizzle", group: "data", note: "typed SQL on top of the Postgres side" },
];

export type Experience = {
  id: string;
  org: string;
  role: string;
  start: string;
  end: string;
  tags: Tag[];
  bullets: string[];
  ref: string; // git-log style ref label in the timeline
};

export const experience: Experience[] = [
  {
    id: "lumix",
    org: "Lumix Solutions",
    role: "Founder & CEO",
    start: "Dec 2025",
    end: "Present",
    tags: ["Infra"],
    ref: "HEAD -> lumix",
    bullets: [
      "Architected and operate Proxmox-based virtualization infrastructure across 50+ Linux servers in the US for game and web hosting.",
      "Built automated VPS provisioning so new customer nodes come up without a human in the loop.",
      "Designed and run the DDoS mitigation layer that keeps customer game servers reachable under attack.",
    ],
  },
  {
    id: "cfx",
    org: "CFX (FiveM)",
    role: "Developer",
    start: "2018",
    end: "Present",
    tags: ["Web", "Infra"],
    ref: "cfx/since-2018",
    bullets: [
      "7+ years shipping scripts and frameworks in Lua and JavaScript to 5,000+ active users.",
      "Cut server-side latency 67% by profiling and rewriting hot paths in the Node.js layer.",
      "Maintained backwards compatibility across years of platform changes without breaking downstream servers.",
    ],
  },
  {
    id: "sec-fantasy",
    org: "SEC Fantasy",
    role: "Full Stack Developer Intern",
    start: "Summer 2026",
    end: "Summer 2026",
    tags: ["Web"],
    ref: "intern/sec-fantasy",
    bullets: [
      "Built React Native features for the fantasy app end to end.",
      "Designed Firestore schema and security rules for user, league, and scoring data.",
      "Wired real-time APIs so scores and lineups update live during games.",
    ],
  },
  {
    id: "gdg",
    org: "GDG @ LSU / Geaux Hack",
    role: "Outreach & Community",
    start: "2025",
    end: "Present",
    tags: ["Web", "AI"],
    ref: "community/gdg-lsu",
    bullets: [
      "Outreach for Google Developer Group at LSU and the Geaux Hack hackathon.",
      "Help get students who have never shipped anything to ship something over a weekend.",
    ],
  },
];

export type Project = {
  id: string;
  name: string;
  summary: string;
  tags: Tag[];
  stack: string[];
  href?: string;
};

export const projects: Project[] = [
  {
    id: "lumix-infra",
    name: "Lumix Infrastructure",
    summary:
      "Proxmox cluster tooling and a control-plane dashboard for 50+ nodes: provisioning, health, and mitigation status in one place.",
    tags: ["Infra"],
    stack: ["Proxmox", "Linux", "Node.js", "TypeScript"],
  },
  {
    id: "cfx-frameworks",
    name: "CFX Frameworks",
    summary:
      "Scripts and server frameworks for FiveM communities, running in front of 5,000+ players. Lua on the game side, Node.js behind it.",
    tags: ["Web", "Infra"],
    stack: ["Lua", "JavaScript", "Node.js"],
    href: "https://github.com/LordOfTheCorgis",
  },
  {
    id: "sec-fantasy",
    name: "SEC Fantasy",
    summary:
      "Mobile fantasy football app for SEC fans. React Native front end, Firestore schema and rules, real-time scoring APIs.",
    tags: ["Web"],
    stack: ["React Native", "Firestore", "TypeScript"],
  },
];

export const serverCount = 50;

export const tagColor: Record<Tag, string> = {
  Infra: "text-orange",
  AI: "text-purple",
  Web: "text-aqua",
};
export const tagBorder: Record<Tag, string> = {
  Infra: "border-orange",
  AI: "border-purple",
  Web: "border-aqua",
};
