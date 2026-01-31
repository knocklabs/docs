"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  EventEmitterContext,
  useEventEmitterInstance,
} from "@byteclaw/use-event-emitter";
import * as analytics from "../../lib/analytics";
import { initAttribution } from "../../lib/attribution";
import { setClearbitPath } from "../../lib/clearbit";
import * as gtag from "../../lib/gtag";

export function Providers({ children }: { children: React.ReactNode }) {
  const eventEmitter = useEventEmitterInstance();
  const pathname = usePathname();

  useEffect(() => {
    initAttribution();
  }, []);

  useEffect(() => {
    gtag.pageview(pathname as unknown as URL);
    setClearbitPath(pathname as unknown as URL);
    analytics.page();
    initAttribution();
  }, [pathname]);

  return (
    <main>
      <EventEmitterContext.Provider value={eventEmitter}>
        {children}
      </EventEmitterContext.Provider>
      {analytics.SEGMENT_WRITE_KEY && <analytics.Snippet />}
    </main>
  );
}
