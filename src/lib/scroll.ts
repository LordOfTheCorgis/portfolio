import type Lenis from "lenis";

/*
  Module-level handle to the Lenis instance so anything can scroll
  programmatically without fighting the smooth scroller. Native
  scrollIntoView + Lenis = two things driving scrollTop, looks awful.
*/
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export function scrollToEl(el: Element, offset = 0) {
  if (instance) {
    instance.scrollTo(el as HTMLElement, { offset, duration: 1.1 });
  } else {
    // reduced-motion path, no lenis
    el.scrollIntoView({ behavior: "auto", block: "start" });
  }
}
