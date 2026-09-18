import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} · Infrastructure & Systems`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 88px",
          background: "#1d2021",
          color: "#ebdbb2",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#928374", marginBottom: 24 }}>
          <span style={{ color: "#b8bb26" }}>evan@lsu</span>
          <span>:</span>
          <span style={{ color: "#83a598" }}>~</span>
          <span style={{ color: "#ebdbb2" }}>$ whoami</span>
        </div>
        <div style={{ display: "flex", fontSize: 148, fontWeight: 800, lineHeight: 0.9, letterSpacing: -6 }}>
          EVAN
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 148,
            fontWeight: 800,
            lineHeight: 0.9,
            letterSpacing: -6,
            color: "#fe8019",
          }}
        >
          VOISEL
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 30, marginTop: 44 }}>
          <span style={{ color: "#8ec07c" }}>CS + AI @ LSU</span>
          <span style={{ color: "#928374" }}>·</span>
          <span style={{ color: "#fe8019" }}>Founder, Lumix Solutions</span>
          <span style={{ color: "#928374" }}>·</span>
          <span style={{ color: "#d3869b" }}>Infrastructure &amp; Systems</span>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 44,
            display: "flex",
            alignItems: "center",
            background: "#282828",
            color: "#a89984",
            fontSize: 22,
            paddingLeft: 0,
          }}
        >
          <span style={{ background: "#fabd2f", color: "#1d2021", padding: "0 18px", height: "100%", display: "flex", alignItems: "center", fontWeight: 700 }}>
            [evan]
          </span>
          <span style={{ padding: "0 16px" }}>0:hero* 1:term 2:stack 3:log 4:proj 5:mail</span>
          <span style={{ marginLeft: "auto", padding: "0 18px", color: "#fe8019" }}>50+ srv · lumix</span>
        </div>
      </div>
    ),
    size,
  );
}
