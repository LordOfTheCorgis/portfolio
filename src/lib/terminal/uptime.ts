import { SITE } from "@/lib/site";

export function formatUptime(now: Date = new Date()): string {
  const ms = Math.max(0, now.getTime() - SITE.launchedAt.getTime());
  const mins = Math.floor(ms / 60000);
  const days = Math.floor(mins / 1440);
  const hours = Math.floor((mins % 1440) / 60);
  const rem = mins % 60;
  const parts: string[] = [];
  if (days) parts.push(`${days} day${days === 1 ? "" : "s"}`);
  if (hours) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  parts.push(`${rem} min${rem === 1 ? "" : "s"}`);
  return parts.join(", ");
}
