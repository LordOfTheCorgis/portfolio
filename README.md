# evanvoisel.com

Personal site. Next.js 16 (App Router), TypeScript, Tailwind v4, GSAP + ScrollTrigger, Lenis, Framer Motion, xterm.js.

```
npm install
npm run dev      # http://localhost:3000
npm run build
```

Deploys to Vercel with zero config.

## Layout

- `src/lib/data.ts` is the only place real content lives. Change a fact there and the hero, neofetch panel and terminal all pick it up.
- `src/lib/site.ts` has the constants (launch date for uptime, links).
- `src/lib/terminal/commands.ts` is the command registry. The xterm terminal runs it, the Cmd+K palette will list it.
- `src/lib/sections.ts` is the list of tmux "windows" in the status bar. Only add a section there once it exists on the page.
- `src/components/` is split by feature (hero, neofetch, terminal, layout, providers).

## Motion

One pattern: things resolve into place. The name scrambles in on load, the terminal auto-types `help` the first time it scrolls into view, that's it. `prefers-reduced-motion` turns all of it off, including Lenis.
