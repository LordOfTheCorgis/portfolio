import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { SITE } from "@/lib/site";

/*
  POST /api/contact
  With RESEND_API_KEY set it sends through Resend's REST API (no SDK, it's
  one fetch). Without it, returns 501 and the client falls back to mailto,
  so the form still works on a fresh Vercel deploy with zero env vars.
*/
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid", issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const { name, email, message, company } = parsed.data;

  // honeypot tripped: pretend it worked, don't tell the bot anything
  if (company) return NextResponse.json({ ok: true });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO ?? SITE.email;
  const from = process.env.CONTACT_FROM ?? "portfolio@evanvoisel.com";
  if (!key) return NextResponse.json({ error: "mail not configured", fallback: "mailto" }, { status: 501 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `evanvoisel.com <${from}>`,
      to: [to],
      reply_to: email,
      subject: `[portfolio] ${name}`,
      text: `${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("resend failed", res.status, detail);
    return NextResponse.json({ error: "send failed", fallback: "mailto" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
