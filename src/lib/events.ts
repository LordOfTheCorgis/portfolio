/*
  Tiny event bus over window so the hero's quick-command chips (and later the
  Cmd+K palette) can tell the terminal to run something without prop drilling
  through the whole page.
*/
export const TERM_RUN = "term:run";

export function runInTerminal(command: string) {
  window.dispatchEvent(new CustomEvent<string>(TERM_RUN, { detail: command }));
}
