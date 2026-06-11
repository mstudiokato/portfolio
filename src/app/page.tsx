import { getFeaturedProjects } from "@/lib/content";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Hero } from "@/components/sections/hero";
import { StatsAndClients } from "@/components/sections/stats-and-clients";
import { SelectedWork } from "@/components/sections/selected-work";
import { Testimonials } from "@/components/sections/testimonials";
import { Services } from "@/components/sections/services";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  // Tylko wyróżnione (featured), posortowane rosnąco po „order" (tak sortuje
  // getFeaturedProjects), dokładnie 4 kafle na stronie głównej (układ 2+2).
  const featured = getFeaturedProjects().slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
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
