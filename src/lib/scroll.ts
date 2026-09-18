import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export function scrollToEl(el: Element, offset = 0) {
  if (instance) {
    instance.scrollTo(el as HTMLElement, { offset, duration: 1.1 });
  } else {

    el.scrollIntoView({ behavior: "auto", block: "start" });
  }
}
