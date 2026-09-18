import Hero from "@/components/hero/Hero";
import TerminalSection from "@/components/terminal/TerminalSection";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <TerminalSection />
    </main>
  );
}
