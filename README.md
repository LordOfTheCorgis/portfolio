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
- `src/lib/terminal/commands.ts` is the command registry. The xterm terminal runs it, the Cmd+K palette lists it.
- `src/lib/sections.ts` is the list of tmux "windows" in the status bar and the Cmd+K "go to" group.
- `src/components/ui/Pane.tsx` wraps every section below the hero in the pane title strip.
- `src/components/` is split by feature (hero, neofetch, terminal, layout, providers).

## Contact form

`POST /api/contact` validates with the shared zod schema. Set `RESEND_API_KEY` (and optionally `CONTACT_TO`, `CONTACT_FROM`) in Vercel and it sends through Resend. With no key it returns 501 and the form opens the visitor's mail client with everything filled in, so it works on day one either way.

## Motion

One pattern: things resolve into place. The name scrambles in on load, the terminal auto-types `help` the first time it scrolls into view, that's it. `prefers-reduced-motion` turns all of it off, including Lenis.
