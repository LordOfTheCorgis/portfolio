/* tiny ansi helper so command output doesn't turn into \x1b soup */
const esc = (code: string) => `\x1b[${code}m`;

export const ansi = {
  reset: esc("0"),
  bold: esc("1"),
  dim: esc("2"),
  // gruvbox via 24-bit colour, xterm honours it
  amber: esc("38;2;250;189;47"),
  "amber-deep": esc("38;2;215;153;33"),
  green: esc("38;2;184;187;38"),
  aqua: esc("38;2;142;192;124"),
  orange: esc("38;2;254;128;25"),
  red: esc("38;2;251;73;52"),
  blue: esc("38;2;131;165;152"),
  purple: esc("38;2;211;134;155"),
  muted: esc("38;2;146;131;116"),
  fg: esc("38;2;235;219;178"),
};

export const c = (color: keyof typeof ansi, s: string) =>
  `${ansi[color]}${s}${ansi.reset}`;
export const b = (s: string) => `${ansi.bold}${s}${ansi.reset}`;
