/*
  Page sections = tmux windows. Order here is the order in the status bar.
  Only list sections that actually exist on the page, dead anchors are worse
  than a shorter bar.
*/
export const sections = [
  { id: "hero", label: "hero" },
  { id: "terminal", label: "term" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
