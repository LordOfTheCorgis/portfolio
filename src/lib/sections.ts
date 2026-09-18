export const sections = [
  { id: "hero", label: "hero" },
  { id: "terminal", label: "term" },
  { id: "stack", label: "stack" },
  { id: "experience", label: "log" },
  { id: "projects", label: "proj" },
  { id: "contact", label: "mail" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
