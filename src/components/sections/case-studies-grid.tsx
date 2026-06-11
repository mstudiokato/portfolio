"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

/**
 * Siatka case studies na /projekty (grid 3-kol desktop / 1 mobile). Kafle są
 * renderowane na serwerze (ProjectCard → ProjectImage czyta wymiary z dysku),
 * więc wstrzykujemy je jako sloty: `children` = pierwsze 6 (zawsze widoczne),
 * `extra` = reszta (rozwijana). Gdy jest co rozwijać → CTA „Zobacz wszystkie
 * projekty ↗" (limonkowy, uppercase) pokazuje resztę bez przeładowania (showAll).
 * Po rozwinięciu przycisk znika.
 */
export function CaseStudiesGrid({
  children,
  extra,
  hasMore,
}: {
  children: ReactNode;
  extra: ReactNode;
  hasMore: boolean;
}) {
  const [showAll, setShowAll] = useState(false);

  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-grid md:gap-y-12 xl:grid-cols-3">
        {children}
        {showAll ? extra : null}
      </div>

      {hasMore && !showAll ? (
        <div className="mt-12 flex justify-center">
          <Button
            variant="primary"
            className="uppercase"
            onClick={() => setShowAll(true)}
          >
            Zobacz wszystkie projekty ↗
          </Button>
        </div>
      ) : null}
    </>
  );
}
