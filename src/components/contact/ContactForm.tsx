"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { SITE } from "@/lib/site";
import Pane from "@/components/ui/Pane";

type Status = { state: "idle" } | { state: "sending" } | { state: "sent" } | { state: "mailto" } | { state: "error"; msg: string };

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), mode: "onBlur" });

  const openMailto = () => {
    const { name, email, message } = getValues();
    const subject = encodeURIComponent(`[portfolio] ${name}`);
    const body = encodeURIComponent(`${name} <${email}>\n\n${message}`);
    window.location.assign(`mailto:${SITE.email}?subject=${subject}&body=${body}`);
    setStatus({ state: "mailto" });
  };

  const onSubmit = async (data: ContactInput) => {
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus({ state: "sent" });
        reset();
        return;
      }
      const json = (await res.json().catch(() => ({}))) as { fallback?: string; error?: string };
      if (json.fallback === "mailto") {
        openMailto();
        return;
      }
      setStatus({ state: "error", msg: json.error ?? `http ${res.status}` });
    } catch {

      openMailto();
    }
  };

  const field = "w-full rounded-sm border border-rule bg-bg px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-amber focus:outline-none";
  const label = "mb-1 block text-[13px] text-fg-dim";

  return (
    <Pane id="contact" index={6} cmd="mail -s '[portfolio]' evan" aside="reply within a day or two">
      <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,1.2fr)]">
        <div className="text-[13px] leading-relaxed text-fg-dim sm:text-sm">
          <p>
            Hiring for infra or full stack, need someone who has actually run a fleet, or want to
            talk shop about Proxmox, FiveM, or LSU? This goes straight to me.
          </p>
          <ul className="mt-6 space-y-2">
            <li>
              <span className="text-muted">github   </span>
              <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="text-aqua hover:underline">
                {SITE.github.replace("https://", "")}
              </a>
            </li>
            <li>
              <span className="text-muted">linkedin </span>
              <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="text-aqua hover:underline">
                {SITE.linkedin.replace("https://www.", "")}
              </a>
            </li>
            <li>
              <span className="text-muted">terminal </span>
              <span className="text-fg">
                <span className="text-green">$</span> contact
              </span>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

          <div className="absolute -left-[9999px]" aria-hidden>
            <label>
              company <input tabIndex={-1} autoComplete="off" {...register("company")} />
            </label>
          </div>

          <div>
            <label htmlFor="c-name" className={label}>
              <span className="text-amber">--name</span>
            </label>
            <input id="c-name" className={field} placeholder="who's asking" autoComplete="name" {...register("name")} />
            {errors.name && <p className="mt-1 text-[12px] text-red">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="c-email" className={label}>
              <span className="text-amber">--reply-to</span>
            </label>
            <input id="c-email" type="email" className={field} placeholder="you@wherever.com" autoComplete="email" {...register("email")} />
            {errors.email && <p className="mt-1 text-[12px] text-red">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="c-message" className={label}>
              <span className="text-amber">--message</span>
            </label>
            <textarea id="c-message" rows={6} className={`${field} resize-y`} placeholder="what's up" {...register("message")} />
            {errors.message && <p className="mt-1 text-[12px] text-red">{errors.message.message}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting || status.state === "sending"}
              className="rounded-sm bg-amber px-4 py-2 text-sm font-bold text-bg transition-colors hover:bg-amber-deep disabled:opacity-60"
            >
              {status.state === "sending" ? "sending…" : "$ send"}
            </button>
            <output aria-live="polite" className="text-[13px]">
              {status.state === "sent" && <span className="text-green">✓ sent. I&apos;ll get back to you.</span>}
              {status.state === "mailto" && (
                <span className="text-fg-dim">opened your mail client with the message filled in.</span>
              )}
              {status.state === "error" && <span className="text-red">✗ {status.msg}. try the links on the left.</span>}
            </output>
          </div>
        </form>
      </div>
    </Pane>
  );
}
