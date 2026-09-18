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

export const stack = [
  { name: "Proxmox VE", group: "infra" },
  { name: "Linux system administration", group: "infra" },
  { name: "Node.js", group: "runtime" },
  { name: "Bun", group: "runtime" },
  { name: "TypeScript / JavaScript", group: "lang" },
  { name: "Lua", group: "lang" },
  { name: "React Native", group: "web" },
  { name: "Firebase / Firestore", group: "data" },
  { name: "Supabase", group: "data" },
  { name: "Drizzle ORM", group: "data" },
] as const;

export type Experience = {
  id: string;
  org: string;
  role: string;
  start: string;
  end: string;
  tags: Tag[];
  bullets: string[];
};

export const experience: Experience[] = [
  {
    id: "lumix",
    org: "Lumix Solutions",
    role: "Founder & CEO",
    start: "Dec 2025",
    end: "Present",
    tags: ["Infra"],
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
