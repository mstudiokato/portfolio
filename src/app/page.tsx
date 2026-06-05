import { getFeaturedProjects } from "@/lib/content";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Hero } from "@/components/sections/hero";
import { StatsAndClients } from "@/components/sections/stats-and-clients";
import { SelectedWork } from "@/components/sections/selected-work";
import { Testimonials } from "@/components/sections/testimonials";
import { Services } from "@/components/sections/services";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  const featured = getFeaturedProjects();

  return (
    <>
      <SiteHeader />
      <main>
        <Hero featured={featured} />
        <StatsAndClients />
        <SelectedWork projects={featured} />
        <Testimonials />
        <Services />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
