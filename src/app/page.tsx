import { getFeaturedProjects } from "@/lib/content";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Hero } from "@/components/sections/hero";
import { CredibilityStrip } from "@/components/sections/credibility-strip";
import { SelectedWork } from "@/components/sections/selected-work";
import { Services } from "@/components/sections/services";
import { AiWorkflow } from "@/components/sections/ai-workflow";
import { Numbers } from "@/components/sections/numbers";
import { ClientList } from "@/components/sections/client-list";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  const featured = getFeaturedProjects();

  return (
    <>
      <SiteHeader />
      <main>
        <Hero featured={featured} />
        <CredibilityStrip />
        <SelectedWork projects={featured} />
        <Services />
        <AiWorkflow />
        <Numbers />
        <ClientList />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
