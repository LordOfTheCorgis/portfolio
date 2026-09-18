import Hero from "@/components/hero/Hero";
import BootLog from "@/components/bootlog/BootLog";
import TerminalSection from "@/components/terminal/TerminalSection";
import StackTree from "@/components/stack/StackTree";
import GitLog from "@/components/experience/GitLog";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ContactForm from "@/components/contact/ContactForm";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <BootLog />
      <TerminalSection />
      <StackTree />
      <GitLog />
      <ProjectGrid />
      <ContactForm />
    </main>
  );
}
