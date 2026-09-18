export const TERM_RUN = "term:run";

export function runInTerminal(command: string) {
  window.dispatchEvent(new CustomEvent<string>(TERM_RUN, { detail: command }));
}
