import type { ReactNode } from "react";

/*
  Every section below the hero is a tmux pane: a title strip with the pane
  index and the command that "produced" the content, then the content.
  Keeps the whole page reading as one session instead of five landing
  page sections wearing a monospace font.
*/
export default function Pane({
  id,
  index,
  cmd,
  aside,
  children,
}: {
  id: string;
  index: number;
  cmd: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="mx-auto w-full max-w-7xl scroll-mt-6 px-5 py-14 sm:px-8 sm:py-20 lg:px-12"
    >
      <header className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-rule pb-3 text-[13px]">
        <span className="text-aqua">pane {index}</span>
        <span className="text-fg">
          <span className="text-green">$</span> {cmd}
        </span>
        {aside && <span className="ml-auto text-muted">{aside}</span>}
      </header>
      {children}
    </section>
  );
}
