/*
  Site-wide constants. Everything the neofetch/terminal/status bar
  needs to agree on lives here so I don't end up with three copies
  of the launch date drifting apart.
*/
export const SITE = {
  name: "Evan Voisel",
  handle: "evan",
  hostname: "lsu",
  url: "https://evanvoisel.com",
  // uptime counts from this. bump it if the site gets a real relaunch.
  launchedAt: new Date("2026-09-17T00:00:00-05:00"),
  tagline: "CS + AI @ LSU · Founder, Lumix Solutions · Infrastructure & Systems",
  description:
    "Evan Voisel: LSU Computer Science + Artificial Intelligence student, founder of Lumix Solutions, running Proxmox infrastructure across 50+ servers. Systems, Linux, and the tooling around them.",
  github: "https://github.com/LordOfTheCorgis",
  linkedin: "https://www.linkedin.com/in/evanvoisel",
  // contact form falls back to mailto here when there's no RESEND_API_KEY
  email: "evanvoisel.official@gmail.com",
} as const;
