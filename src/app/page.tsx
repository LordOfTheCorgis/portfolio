import Hero from "@/components/hero/Hero";
import BootLog from "@/components/bootlog/BootLog";
import TerminalSection from "@/components/terminal/TerminalSection";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <BootLog />
      <TerminalSection />
    </main>
  );
}
