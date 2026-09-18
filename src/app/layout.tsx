import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import StatusBar from "@/components/layout/StatusBar";
import CommandPalette from "@/components/palette/CommandPalette";

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} · Infrastructure & Systems`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Evan Voisel",
    "LSU",
    "Computer Science",
    "Artificial Intelligence",
    "Lumix Solutions",
    "Proxmox",
    "Linux",
    "infrastructure",
    "FiveM",
    "CFX",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    url: SITE.url,
    title: `${SITE.name} · Infrastructure & Systems`,
    description: SITE.description,
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} · Infrastructure & Systems`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1d2021",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jetbrains.variable} h-full`}>
      <body className="crt min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
        <StatusBar />
        <CommandPalette />
      </body>
    </html>
  );
}
