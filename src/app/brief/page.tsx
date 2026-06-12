import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { BriefForm } from "@/components/brief/BriefForm";

export const metadata: Metadata = {
  title: "Brief projektowy",
  description:
    "Wypełnij brief — powie nam czego potrzebujesz zanim się odezwiemy.",
  robots: { index: false, follow: false },
};

export default function BriefPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <BriefForm />
      </main>
      <SiteFooter />
    </>
  );
}
