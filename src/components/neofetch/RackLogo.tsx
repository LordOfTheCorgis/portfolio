const UNITS = 4;

export default function RackLogo() {
  return (
    <pre
      aria-hidden
      className="text-[13px] leading-[1.15] sm:text-sm text-fg-dim select-none"
    >
      <span className="text-rule-strong">{"┌────────────────┐\n"}</span>
      {Array.from({ length: UNITS }).map((_, i) => (
        <span key={i}>
          <span className="text-rule-strong">│ </span>
          <span className={["text-amber-deep","text-orange","text-amber-deep","text-red"][i % 4]}>▓▓▓▓▓▓▓▓</span>
          <span className="text-rule-strong"> ·· </span>
          <span
            className="led text-green"
            style={{ ["--led-delay" as string]: `${i * 0.7}s`, ["--led-period" as string]: `${2.1 + i * 0.4}s` }}
          >
            ●
          </span>
          <span> </span>
          <span
            className={`led ${i === 2 ? "text-aqua" : "text-amber"}`}
            style={{ ["--led-delay" as string]: `${i * 0.35 + 0.2}s`, ["--led-period" as string]: "1.3s" }}
          >
            ●
          </span>
          <span className="text-rule-strong"> │</span>
          {"\n"}
          {i < UNITS - 1 && <span className="text-rule-strong">{"├────────────────┤\n"}</span>}
        </span>
      ))}
      <span className="text-rule-strong">{"└────────────────┘"}</span>
    </pre>
  );
}
